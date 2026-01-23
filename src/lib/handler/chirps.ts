import { Request, Response } from "express";
import { handlerValidateChirp } from "./validateChirp.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/errors.js";
import { db } from "../../db/index.js";
import { chirps } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerChirps(req: Request, res: Response) {
  const { body, userId } = validateRequest(req);
  const { cleanedBody } = handlerValidateChirp(body);

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
    throw new BadRequestError("Malformed request body");
  }

  return { body, userId };
}

export async function handlerChirpsBatch(req: Request, res: Response) {
  const { authorId } = req.query;

  let authorIdString = undefined;
  if (typeof authorId === "string") authorIdString = authorId;

  try {
    const results = await db
      .select()
      .from(chirps)
      .where(authorIdString ? eq(chirps.userId, authorIdString) : undefined);

    if (results.length === 0) console.warn("no chirps in database");

    res.status(200).json(results);
  } catch (err) {
    throw err;
  }
}

export async function handlerChirpGet(req: Request, res: Response) {
  const chirpId = req.params.chirpId;

  const chirp = await getChirpById(chirpId);

  res.status(200).json(chirp);
}

export async function handlerChirpDelete(req: Request, res: Response) {
  const chirpId = req.params.chirpId;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwtSecret);

  const chirp = await getChirpById(chirpId);

  if (chirp.userId !== userId)
    throw new ForbiddenError("userId does not match chirpId");

  const [deletedChirp] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId))
    .returning();
  if (!deletedChirp) {
    throw new NotFoundError(`no chirp found to be deleted`);
  }

  res.sendStatus(204);
}

async function getChirpById(id: string) {
  const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));
  if (!chirp) {
    throw new NotFoundError(`no chirp with id ${id} in database`);
  }

  return chirp;
}
