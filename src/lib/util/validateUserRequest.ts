import { BadRequestError } from "../errors/errors.js";
import { Request } from "express";

export function validateUserRequest(req: Request) {
  if (!req.body?.email && typeof req.body.email != "string")
    throw new BadRequestError("no email in request");
  if (!req.body?.password && typeof req.body.password != "string")
    throw new BadRequestError("no password in request");

  return { email: req.body.email, password: req.body.password };
}
