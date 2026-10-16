"use server"

import { headers } from "next/headers";
import { auth } from "../auth";

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