import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors.js";
import { getAPIKey, getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export function requireAPIKey(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const apiKey = getAPIKey(req);
    if (!apiKey) throw new UnauthorizedError();
  } catch (e) {
    throw new UnauthorizedError();
  }

  next();
}
