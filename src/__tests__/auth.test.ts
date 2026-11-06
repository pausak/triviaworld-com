import { describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { createToken, verifyToken } from "@/lib/auth";

describe("session tokens", () => {
  it("round-trips the user id", async () => {
    expect(await verifyToken(await createToken("user-1"))).toEqual({ userId: "user-1" });
  });

  it("rejects a token that was altered", async () => {
    const token = await createToken("user-1");
    const [h, , s] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ userId: "someone-else" })).toString("base64url");
    expect(await verifyToken(`${h}.${forged}.${s}`)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const other = await new SignJWT({ userId: "user-1" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("not-the-secret"));
    expect(await verifyToken(other)).toBeNull();
  });

  it("rejects garbage", async () => {
    expect(await verifyToken("not.a.token")).toBeNull();
    expect(await verifyToken("")).toBeNull();
  });
});
