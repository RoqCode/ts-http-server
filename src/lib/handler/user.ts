import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { BadRequestError } from "../errors/errors.js";
import { users } from "../../db/schema.js";

export async function handlerUsers(req: Request, res: Response) {
  const email = validateRequest(req);

  const [result] = await db
    .insert(users)
    .values({
      email,
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
  return req.body.email;
}
