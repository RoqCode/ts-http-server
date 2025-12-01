import { Request, Response, NextFunction } from "express";
import { apiConfig } from "../config.js";

export function requestMetrics(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  apiConfig.fileserverHits++;
  next();
}
