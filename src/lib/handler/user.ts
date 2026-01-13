import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { BadRequestError } from "../errors/errors.js";
import { users } from "../../db/schema.js";
import { hashPassword } from "../auth.js";

export async function handlerUsers(req: Request, res: Response) {
  const { email, password } = validateRequest(req);
  const hashedPassword = await hashPassword(password);

  const [result] = await db
    .insert(users)
    .values({
      email,
      hashedPassword,
    })
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  res.status(201).json(result);
}

function validateRequest(req: Request) {
  if (!req.body?.email) throw new BadRequestError("no email in request");
  if (!req.body?.password) throw new BadRequestError("no password in request");
  return { email: req.body.email, password: req.body.password };
}
