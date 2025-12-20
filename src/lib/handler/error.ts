import { NextFunction, Request, Response } from "express";

export function handlerError(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.log("Error caught in middleware: ", error.message);
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
