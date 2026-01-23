import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { hashPassword } from "../auth.js";
import { validateUserRequest } from "../util/validateUserRequest.js";

export async function handlerUsers(req: Request, res: Response) {
  try {
    const { email, password } = validateUserRequest(req);
    const hashedPassword = await hashPassword(password);

    const [result] = await db
      .insert(users)
      .values({ email, hashedPassword })
      .returning({
        id: users.id,
        email: users.email,
        isChirpyRed: users.isChirpyRed,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return res.status(201).json(result);
  } catch (err) {
    console.error("[handlerUsers] DB error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
