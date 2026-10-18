
import "server-only";
import { createHmac } from "node:crypto";
import arcjet, { fixedWindow, request } from "@arcjet/next";

export type AuthRateAction =
  | "sign-in"
  | "sign-up"
  | "password-reset"
  | "reset-password"
  | "verify-email"
  | "confirm-email"
  | "change-email"
  | "change-password";

export type RateLimitResult =
  | { status: "allowed"; valid: true; message: "" }
  | { status: "denied" | "unavailable"; valid: false; message: string };

type RatePolicy = {
  window: string;
  maxByIP: number;
  maxByIdentity: number;
};

const policies: Record<AuthRateAction, RatePolicy> = {
  "sign-in": { window: "5m", maxByIP: 20, maxByIdentity: 5 },
  "sign-up": { window: "1h", maxByIP: 10, maxByIdentity: 3 },
  "password-reset": { window: "1h", maxByIP: 15, maxByIdentity: 3 },
  "reset-password": { window: "15m", maxByIP: 20, maxByIdentity: 5 },
  "verify-email": { window: "1h", maxByIP: 15, maxByIdentity: 3 },
  "confirm-email": { window: "15m", maxByIP: 40, maxByIdentity: 10 },
  "change-email": { window: "1h", maxByIP: 15, maxByIdentity: 3 },
  "change-password": { window: "15m", maxByIP: 20, maxByIdentity: 5 },
};

const aj = arcjet({
  key: process.env.ARCJET_API_KEY!,
  rules: [],
});

const unavailable: RateLimitResult = {
  status: "unavailable",
  valid: false,
  message: "Authentication is temporarily unavailable. Please try again later.",
};

const denied: RateLimitResult = {
  status: "denied",
  valid: false,
  message: "Too many attempts. Please try again later.",
};

export const validateAuthRate = async (
  action: AuthRateAction,
  identity?: string
): Promise<RateLimitResult> => {
  const secret = process.env.RATE_LIMIT_HASH_SECRET ?? process.env.BETTER_AUTH_SECRET;

  if (!process.env.ARCJET_API_KEY || !secret) {
    console.error("[auth-rate] Missing rate-limit configuration.");
    return unavailable;
  }

  try {
    const req = await request();
    const policy = policies[action];
    const value = identity?.trim();

    const fingerprint = value
      ? createHmac("sha256", secret).update(`${action}:${value}`).digest("hex")
      : undefined;

    const ipRule = fixedWindow({
      mode: "LIVE",
      window: policy.window,
      max: policy.maxByIP,
      characteristics: ["ip.src", "authOperation"],
    });

    const limiter = fingerprint
      ? aj.withRule(ipRule).withRule(
          fixedWindow({
            mode: "LIVE",
            window: policy.window,
            max: policy.maxByIdentity,
            characteristics: ["authOperation", "authIdentity"],
          })
        )
      : aj.withRule(ipRule);

    const decision = await limiter.protect(req, {
      authOperation: action,
      ...(fingerprint ? { authIdentity: fingerprint } : {}),
    });

    if (decision.isErrored()) {
      console.error("[auth-rate] Arcjet unavailable:", action);
      return unavailable;
    }

    if (decision.isDenied()) return denied;

    return { status: "allowed", valid: true, message: "" };
  } catch (error) {
    console.error("[auth-rate] Check failed:", action, error);
    return unavailable;
  }
};
