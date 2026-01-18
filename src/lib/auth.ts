import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "./errors/errors.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return argon2.verify(hash, password);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;

  const payload: Payload = {
    iss: "chiry",
    sub: userID,
    iat,
    exp,
  };

  return jwt.sign(payload, secret);
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
