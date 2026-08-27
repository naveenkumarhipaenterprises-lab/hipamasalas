import type { Request } from "express";
import { describe, expect, it } from "vitest";
import { getSessionCookieOptions } from "./cookies";

describe("session cookie options", () => {
  it("uses a browser-compatible lax cookie for local HTTP development", () => {
    const options = getSessionCookieOptions({ protocol: "http", headers: {} } as Request);

    expect(options).toMatchObject({ httpOnly: true, path: "/", sameSite: "lax", secure: false });
  });

  it("retains secure cross-site cookie settings for HTTPS deployments", () => {
    const options = getSessionCookieOptions({ protocol: "https", headers: {} } as Request);

    expect(options).toMatchObject({ sameSite: "none", secure: true });
  });
});
