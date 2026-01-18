import { describe, it, expect, beforeAll, vi } from "vitest";
import jwt from "jsonwebtoken";
import {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  validateJWT,
} from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash(password2 + "_", hash2);
    expect(result).toBe(false);
  });

  it("should not return the original password as the hash", () => {
    expect(hash1).not.toBe(password1);
  });

  it("should produce different hashes for the same password", async () => {
    const hashAgain = await hashPassword(password1);
    expect(hashAgain).not.toBe(hash1);
  });
});

describe("JWT", () => {
  const secret = "super-secret";
  const userID = "user-123";

  it("should encode and validate a user id", () => {
    const token = makeJWT(userID, 60, secret);
    const validated = validateJWT(token, secret);
    expect(validated).toBe(userID);
  });

  it("should include exp and iat claims based on current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const token = makeJWT(userID, 120, secret);
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    expect(decoded.iat).toBe(1704067200);
    expect(decoded.exp).toBe(1704067320);

    vi.useRealTimers();
  });

  it("should reject tokens signed with the wrong secret", () => {
    const token = makeJWT(userID, 60, "other-secret");
    expect(() => validateJWT(token, secret)).toThrow("token could not be verified");
  });

  it("should reject tokens missing a user id", () => {
    const token = jwt.sign({ iss: "chiry" }, secret);
    expect(() => validateJWT(token, secret)).toThrow("token could not be verified");
  });

  it("should reject expired tokens", () => {
    const expiredToken = jwt.sign(
      {
        sub: userID,
        exp: Math.floor(Date.now() / 1000) - 10,
      },
      secret,
    );

    expect(() => validateJWT(expiredToken, secret)).toThrow(
      "token could not be verified",
    );
  });
});
