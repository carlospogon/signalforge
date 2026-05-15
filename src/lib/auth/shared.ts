import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE = "synaptik_admin_session";
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12;

type AdminSessionPayload = {
  role: "admin";
  email: string;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable.");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(email: string) {
  return new SignJWT({
    role: "admin",
    email
  } satisfies AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"]
    });

    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }

    return {
      role: "admin" as const,
      email: payload.email
    };
  } catch {
    return null;
  }
}

export function getAdminSessionMaxAge() {
  return ADMIN_SESSION_DURATION_SECONDS;
}
