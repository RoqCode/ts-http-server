import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function requestMetrics(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  config.fileserverHits++;
  next();
}
