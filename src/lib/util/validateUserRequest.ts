import { BadRequestError } from "../errors/errors.js";
import { Request } from "express";

type ValidatedRequest = {
  email: string;
  password: string;
  expiresInSeconds?: number;
};

export function validateUserRequest(req: Request): ValidatedRequest {
  if (!req.body?.email && typeof req.body.email != "string")
    throw new BadRequestError("no email in request");
  if (!req.body?.password && typeof req.body.password != "string")
    throw new BadRequestError("no password in request");

  return {
    email: req.body.email,
    password: req.body.password,
  };
}
