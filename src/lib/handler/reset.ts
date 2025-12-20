import { Request, Response } from "express";
import { ForbiddenError } from "../errors/errors.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { config } from "../config.js";
process.loadEnvFile();

export async function handlerReset(_req: Request, res: Response) {
  if (process.env.PLATFORM !== "dev") throw new ForbiddenError();

  await db.delete(users);
  config.fileserverHits = 0;
  res.status(200).send("users table reset");
}
