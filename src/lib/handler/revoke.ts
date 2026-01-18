import { Request, Response } from "express";
import { getBearerToken } from "../auth.js";
import { db } from "../../db/index.js";
import { refreshTokens } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export async function handlerRevoke(req: Request, res: Response) {
  const token = getBearerToken(req);

  await db
    .update(refreshTokens)
    .set({ expiresAt: new Date(Date.now()) })
    .where(eq(refreshTokens.token, token));

  res.sendStatus(204);
}
