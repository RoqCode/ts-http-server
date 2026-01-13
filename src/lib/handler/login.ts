import { Request, Response } from "express";
import { validateUserRequest } from "../util/validateUserRequest.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { checkPasswordHash } from "../auth.js";
import { NotFoundError, UnauthorizedError } from "../errors/errors.js";

export async function handlerLogin(req: Request, res: Response) {
  const { email, password } = validateUserRequest(req);

  const [result] = await db.select().from(users).where(eq(users.email, email));

  if (!result.hashedPassword)
    throw new NotFoundError(`no password found for user ${email}`);

  const isCorrect = await checkPasswordHash(password, result.hashedPassword);
  if (!isCorrect) throw new UnauthorizedError("password was not correct");
  console.log("Successfully logged in!");
  const { hashedPassword, ...userObject } = result;

  res.status(200).send(userObject);
}
