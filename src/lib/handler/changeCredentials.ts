import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { validateUserRequest } from "../util/validateUserRequest.js";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../errors/errors.js";
import { config } from "../config.js";

export async function handlerChangeCredentials(req: Request, res: Response) {
  try {
    const { email, password } = validateUserRequest(req);
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwtSecret);
    const hashedPassword = await hashPassword(password);

    const [result] = await db
      .update(users)
      .set({ email, hashedPassword })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!result) {
      console.warn(`user not found in db: ${result}, ${email}`);
      throw new NotFoundError("user not found");
    }

    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }

    console.error("[handlerUsers] DB error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
