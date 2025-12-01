import { Request, Response } from "express";
import { apiConfig } from "../config.js";

export function handlerReset(_req: Request, res: Response) {
  apiConfig.fileserverHits = 0;
  res.status(200).send();
}
