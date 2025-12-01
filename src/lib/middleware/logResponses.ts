import { NextFunction, Request, Response } from "express";

export function logResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => logStatus(req, res));
  next();
}

function logStatus(req: Request, res: Response) {
  if (res.statusCode >= 400 && res.statusCode < 600) {
    console.log(
      `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
    );
  }
}
