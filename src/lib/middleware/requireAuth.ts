import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  let jwtUserId: string;
  try {
    const token = getBearerToken(req);

    jwtUserId = validateJWT(token, config.jwtSecret);
  } catch (e) {
    throw new UnauthorizedError();
  }

  req.userId = jwtUserId;
  next();
}
