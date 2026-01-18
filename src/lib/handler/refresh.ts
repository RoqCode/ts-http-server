import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { db } from "../../db/index.js";
import { refreshTokens, users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { UnauthorizedError } from "../errors/errors.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);

  const user = await getUserFromRefreshToken(token);

  const jwt = makeJWT(user.id, 3600, config.jwtSecret);

  res.status(200).send({ token: jwt });
}

async function getUserFromRefreshToken(token: string) {
  const [result] = await db
    .select({
      refreshToken: refreshTokens,
      user: users,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, token));

  const now = new Date(Date.now());
  if (!result.user.id || result.refreshToken.expiresAt < now)
    throw new UnauthorizedError();

  return result?.user;
}
