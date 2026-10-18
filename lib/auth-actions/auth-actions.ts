"use server"

import { headers } from "next/headers";
import { auth } from "../auth";
import { changeEmailSchema } from "../validations/settngs";
import { changePasswordSchema } from "../validations/password";
import { getPublicError, handleActionError } from "../actionError";
import { getUserSession } from "./auth-helpers";

export const signInUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    await auth.api.signInEmail({
      body: { email: email.trim().toLowerCase(), password },
      headers: await headers(),
    });

    return { 
      success: true as const, 
      message: "User successfully logged in." 
    };
  } catch {
    return { 
      success: false as const, 
      message: "Invalid email or password." 
    };
  }
};

export const logoutUser = async () => {
  try {
    const result = await auth.api.signOut({
      headers: await headers(),
    });

    if (!result.success) {
      return {
        success: false, 
        message: "An error occured logging out"
      }
    }

    return {
      success: true as const,
      message: "Signed out successfully.",
    };
  } catch (error) {
    return {
        success: false, 
        message: "An error occured logging out",
        error: error
      }
  }
};

export const sendResetPasswordEmail = async ({email}: {email: string}) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const publicMessage = "If an eligible account exists for this email, a reset link has been sent.";

    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;

    await auth.api.requestPasswordReset({
      body: {email: normalizedEmail, redirectTo},
    });

    return {success: true as const, message: publicMessage};
  } catch (error) {
    return handleActionError(error, "sendResetPasswordEmail");
  }
};

export const changeUserEmail = async ({email}: {email: string}) => {
  try {
    const session = await getUserSession();
    if(!session?.user){
      return getPublicError("UNAUTHORIZED");
    }
    if (!session.user.emailVerified) {
      return {
        success: false as const,
        code: "EMAIL_NOT_VERIFIED" as const,
        message: "Verify your current email before changing it.",
      };
    }

    const parsed = changeEmailSchema.safeParse({ email });
    if (!parsed.success) {
      return {
        success: false as const,
        code: "VALIDATION_ERROR" as const,
        message: parsed.error.issues[0]?.message || "Invalid email address.",
      };
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    if (normalizedEmail === session.user.email.toLowerCase()) {
      return {
        success: false as const,
        code: "SAME_EMAIL" as const,
        message: "Enter a different email address.",
      };
    }

    await auth.api.changeEmail({
      body:{
        newEmail: normalizedEmail,
        callbackURL: "/email-change-approved", 
      },
      headers: await headers(), 
    })

    return {
      success: true as const, 
      message: `A request for an email change has been sent to your current email`
    }
  } catch (error) {
    return handleActionError(error, "changeUserEmail");
  }
}

export const changeUserPassword = async ({currentPassword, newPassword, confirmPassword}: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
}) => {
  try {
    const session = await getUserSession();
    if(!session?.user){
      return getPublicError("UNAUTHORIZED");
    }

    const parsed = changePasswordSchema.safeParse({currentPassword, newPassword, confirmPassword});
    if(!parsed.success){
      return {
        success: false as const,
        code: "VALIDATION_ERROR" as const,
        message: parsed.error.issues[0]?.message ?? "Invalid password.",
      };
    }

    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return {
      success: true as const,
      message: "Password changed successfully.",
    };
  } catch(error) {
    return handleActionError(error, "changeUserPassword");
  }
};