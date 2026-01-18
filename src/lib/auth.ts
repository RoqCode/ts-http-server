import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { BadRequestError } from "./errors/errors.js";

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return argon2.verify(hash, password);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const token = jwt.verify(tokenString, secret);

    if (!token.sub || typeof token.sub !== "string") {
      console.error("no userID found in token");
      throw new BadRequestError("no userID found in token");
    }

    return token.sub;
  } catch (e) {
    console.warn(e);
    throw new BadRequestError("token could not be verified");
  }
}
