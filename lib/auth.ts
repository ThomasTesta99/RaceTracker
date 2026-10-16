import { db } from "@/database/drizzle";
import { betterAuth } from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle"
import * as schema from "@/database/auth-schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', 
        schema
    }),
    emailAndPassword: {
        enabled: true, 
        disableSignUp: true, 
    },
    plugins: [nextCookies()],

});