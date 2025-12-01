import { Request, Response } from "express";
import { apiConfig } from "../config.js";

export function handlerMetrics(_req: Request, res: Response) {
  res
    .set("Content-Type", "text/plain; charset=utf-8")
    .status(200)
    .send(`Hits: ${apiConfig.fileserverHits}`);
}
