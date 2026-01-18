import { Request, Response } from "express";
import { validateUserRequest } from "../util/validateUserRequest.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { NotFoundError, UnauthorizedError } from "../errors/errors.js";
import { config } from "../config.js";

const ONE_HOUR = 60 * 60;

export async function handlerLogin(req: Request, res: Response) {
  const { email, password, expiresInSeconds } = validateUserRequest(req);

  let normalizedEIS = 0;
  if (!expiresInSeconds || expiresInSeconds <= 0 || expiresInSeconds > ONE_HOUR)
    normalizedEIS = ONE_HOUR;

  const [result] = await db.select().from(users).where(eq(users.email, email));

  if (!result.hashedPassword)
    throw new NotFoundError(`no password found for user ${email}`);

  const isCorrect = await checkPasswordHash(password, result.hashedPassword);
  if (!isCorrect) throw new UnauthorizedError("password was not correct");
  console.log("Successfully logged in!");
  const { hashedPassword, ...userObject } = result;

  const jwt = makeJWT(userObject.id, normalizedEIS, config.jwtSecret);

  const response = {
    ...userObject,
    token: jwt,
  };

  res.status(200).send(response);
}
