import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/errors.js";

export function handlerError(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error.message) console.log("[Middleware Error]: ", error.message);

  if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message || "Bad Request" });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message || "Unauthorized" });
    return;
  }

  if (error instanceof ForbiddenError) {
    res.status(403).json({ error: error.message || "Forbidden" });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message || "Not Found" });
    return;
  }

  res.status(500).json({ error: "Internal Server Error" });
}
