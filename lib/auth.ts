import { db } from "@/database/drizzle";
import { betterAuth } from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle"
import * as schema from "@/database/auth-schema";
import { nextCookies } from "better-auth/next-js";
import { sendEmail, sendVerifiation } from "./email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', 
        schema
    }),
    emailAndPassword: {
        enabled: true, 
        disableSignUp: true, 
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({user, url}) => {
            try {
                await sendEmail({to: user.email, resetLink: url});
            } catch {
                console.error("[password-reset] Reset email delivery failed.");
            }
        },
    },
    emailVerification:{
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({user, url}) => {
            const verificationUrl = new URL(url);
            if(verificationUrl.searchParams.get("callbackURL") === "/email-change-approved"){
                verificationUrl.searchParams.set("callbackURL", "/email-verified");
            }
            await sendVerifiation({
                to: user.email, 
                subject: "Verify your email",
                templateParams: {
                    user_name: user.name ?? "there", 
                    action_url: verificationUrl.toString(), 
                    type_header: "Verify your email",
                    type_body: "verfiy your email"
                }
            })
        }
    },
    user:{
        changeEmail: {
                enabled: true, 
                sendChangeEmailConfirmation: async ({user, url}) => {
                    await sendVerifiation({
                        to: user.email, 
                        subject: "Approve Email Change", 
                        templateParams: {
                            user_name: user.name ?? "there", 
                            action_url: url, 
                            type_header: "Change your email",
                            type_body: "change your email",
                        }
                    })
                }
            },
    },
    plugins: [nextCookies()],

});