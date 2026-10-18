
import "server-only";
import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { validateAuthRate, type AuthRateAction } from "@/lib/arcjet";

export const createAuthRateHook = () => createAuthMiddleware(async (ctx) => {
  const email = typeof ctx.body?.email === "string"
    ? ctx.body.email.trim().toLowerCase()
    : undefined;

  const token = typeof ctx.body?.token === "string"
    ? ctx.body.token
    : undefined;

  let action: AuthRateAction;
  let identity: string | undefined;

  switch (ctx.path) {
    case "/sign-in/email":
      action = "sign-in";
      identity = email ? `email:${email}` : undefined;
      break;

    case "/sign-up/email":
      action = "sign-up";
      identity = email ? `email:${email}` : undefined;
      break;

    case "/request-password-reset":
      action = "password-reset";
      identity = email ? `email:${email}` : undefined;
      break;

    case "/reset-password":
      action = "reset-password";
      identity = token ? `token:${token}` : undefined;
      break;

    case "/send-verification-email":
      action = "verify-email";
      identity = email ? `email:${email}` : undefined;
      break;

    case "/verify-email":
      action = "confirm-email";
      identity = typeof ctx.query?.token === "string"
        ? `token:${ctx.query.token}`
        : undefined;
      break;

    case "/change-email":
    case "/change-password":
    case "/verify-password": {
      if (!ctx.headers) {
        throw new APIError("UNAUTHORIZED", {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        });
      }

      const session = await getSessionFromCtx(ctx, {
        disableCookieCache: true,
      });

      if (!session?.user?.id) {
        throw new APIError("UNAUTHORIZED", {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        });
      }

      action = ctx.path === "/change-email"
        ? "change-email"
        : "change-password";

      identity = `user:${session.user.id}`;
      break;
    }

    default:
      return;
  }

  const rateLimit = await validateAuthRate(action, identity);

  if (rateLimit.status === "denied") {
    throw new APIError("TOO_MANY_REQUESTS", {
      code: "RATE_LIMITED",
      message: rateLimit.message,
    });
  }

  if (rateLimit.status === "unavailable") {
    throw new APIError("SERVICE_UNAVAILABLE", {
      code: "RATE_LIMIT_UNAVAILABLE",
      message: rateLimit.message,
    });
  }
});
