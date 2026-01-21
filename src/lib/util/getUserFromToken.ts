import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { refreshTokens, users } from "../../db/schema.js";
import { UnauthorizedError } from "../errors/errors.js";

export async function getUserFromRefreshToken(token: string) {
  const [result] = await db
    .select({
      refreshToken: refreshTokens,
      user: users,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, token));

  const now = new Date(Date.now());
  if (!result?.user?.id || result?.refreshToken?.expiresAt < now) {
    console.warn(`user not found from refresh token: ${result}, ${token}`);
    throw new UnauthorizedError();
  }

  return result?.user;
}
