import { afterEach, describe, expect, it, vi } from "vitest";
import { createToken, verifyToken } from "@/lib/auth";

afterEach(() => vi.unstubAllEnvs());

describe("the signing secret in production", () => {
  it("refuses to sign anything without one", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "");
    await expect(createToken("user-1")).rejects.toThrow("JWT_SECRET");
  });

  it("refuses the development value printed in the repository", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "triviaworld-dev-secret-change-in-production");
    await expect(createToken("user-1")).rejects.toThrow("JWT_SECRET");
  });

  it("does not accept a token signed with the development value", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const forged = await createToken("user-1");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "a-real-secret-only-production-knows");
    expect(await verifyToken(forged)).toBeNull();
  });

  it("works with a real one", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "a-real-secret-only-production-knows");
    expect(await verifyToken(await createToken("user-1"))).toEqual({ userId: "user-1" });
  });
});
