import { Request, Response } from "express";
import { handlerValidateChirp } from "./validateChirp.js";
import { BadRequestError } from "../errors/errors.js";
import { db } from "../../db/index.js";
import { chirps } from "../../db/schema.js";

export async function handlerChirps(req: Request, res: Response) {
  const { body, userId } = validateRequest(req);
  const { cleanedBody } = handlerValidateChirp(body);

  // save chirp in bd
  try {
    const [newChirp] = await db
      .insert(chirps)
      .values({ body: cleanedBody, userId: userId })
      .returning();

    res.status(201).json(newChirp);
  } catch (err) {
    throw err;
  }
}

function validateRequest(req: Request) {
  if (!req.body || typeof req.body !== "object") {
    throw new BadRequestError("Request body must be an object");
  }

  const { body, userId } = req.body as Record<string, unknown>;

  if (typeof body !== "string" || typeof userId !== "string") {
    throw new BadRequestError("Malformed request body");
  }

  return { body, userId };
}
