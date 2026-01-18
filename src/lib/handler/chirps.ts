import { Request, Response } from "express";
import { handlerValidateChirp } from "./validateChirp.js";
import { BadRequestError, NotFoundError } from "../errors/errors.js";
import { db } from "../../db/index.js";
import { chirps } from "../../db/schema.js";
import { eq } from "drizzle-orm";

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

  const { body } = req.body as Record<string, unknown>;
  const userId = req.userId;

  if (typeof body !== "string" || typeof userId !== "string") {
    console.log("---------------------------");
    console.log(body, userId);
    throw new BadRequestError("Malformed request body");
  }

  return { body, userId };
}

export async function handlerChirpsBatch(_req: Request, res: Response) {
  try {
    const results = await db.select().from(chirps);

    if (results.length === 0) console.warn("no chirps in database");

    res.status(200).json(results);
  } catch (err) {
    throw err;
  }
}

export async function handlerChirp(req: Request, res: Response) {
  const chirpId = req.params.chirpId;

  try {
    const [chirp] = await db
      .select()
      .from(chirps)
      .where(eq(chirps.id, chirpId));

    if (!chirp) {
      throw new NotFoundError(`no chirp with id ${chirpId} in database`);
    }

    res.status(200).json(chirp);
  } catch (err) {
    throw err;
  }
}
