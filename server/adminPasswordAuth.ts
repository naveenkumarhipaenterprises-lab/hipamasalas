import { parse as parseCookieHeader } from "cookie";
import { timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";

export const ADMIN_SESSION_COOKIE = "hipa_admin_session";
const ADMIN_SESSION_AUDIENCE = "hipa-admin";
const ADMIN_SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function secretKey() {
  return new TextEncoder().encode(ENV.cookieSecret);
}

function credentialsMatch(submitted: string, configured: string) {
  const submittedBuffer = Buffer.from(submitted);
  const configuredBuffer = Buffer.from(configured);
  if (submittedBuffer.length !== configuredBuffer.length) return false;
  return timingSafeEqual(submittedBuffer, configuredBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
  if (!ENV.adminLoginUsername || !ENV.adminLoginPassword || !ENV.cookieSecret) return false;
  return credentialsMatch(username, ENV.adminLoginUsername) && credentialsMatch(password, ENV.adminLoginPassword);
}

export async function createAdminSessionToken() {
  const expiresAt = Math.floor((Date.now() + ADMIN_SESSION_DURATION_MS) / 1000);
  return new SignJWT({ scope: "password-admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setAudience(ADMIN_SESSION_AUDIENCE)
    .setExpirationTime(expiresAt)
    .sign(secretKey());
}

export async function hasAdminSession(req: Request) {
  const cookieHeader = req.headers.cookie;
  const token = cookieHeader ? parseCookieHeader(cookieHeader)[ADMIN_SESSION_COOKIE] : undefined;
  if (!token || !ENV.cookieSecret) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"], audience: ADMIN_SESSION_AUDIENCE });
    return payload.scope === "password-admin";
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_MAX_AGE_MS = ADMIN_SESSION_DURATION_MS;
