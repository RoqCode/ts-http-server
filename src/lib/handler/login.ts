import { Request, Response } from "express";
import { validateUserRequest } from "../util/validateUserRequest.js";
import { db } from "../../db/index.js";
import { refreshTokens, users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { NotFoundError, UnauthorizedError } from "../errors/errors.js";
import { config } from "../config.js";

const ONE_HOUR = 60 * 60;

export async function handlerLogin(req: Request, res: Response) {
  const { email, password } = validateUserRequest(req);

  const [result] = await db.select().from(users).where(eq(users.email, email));

  if (!result.hashedPassword)
    throw new NotFoundError(`no password found for user ${email}`);

  const isCorrect = await checkPasswordHash(password, result.hashedPassword);
  if (!isCorrect) throw new UnauthorizedError("password was not correct");
  console.log("Successfully logged in!");
  const { hashedPassword, ...userObject } = result;

  const jwt = makeJWT(userObject.id, ONE_HOUR, config.jwtSecret);
  const refreshToken = makeRefreshToken();

  saveRefreshToken(refreshToken, userObject.id);

  const response = {
    ...userObject,
    token: jwt,
    refreshToken,
  };

  res.status(200).send(response);
}

async function saveRefreshToken(token: string, userId: string) {
  const in60Days = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  try {
    await db
      .insert(refreshTokens)
      .values({ token, userId, expiresAt: in60Days });
  } catch (err) {
    throw err;
  }
}
