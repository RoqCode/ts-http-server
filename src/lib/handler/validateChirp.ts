import { Request, Response } from "express";
import { BadRequestError } from "../errors/errors.js";

const badWords = ["kerfuffle", "sharbert", "fornax"];

export function handlerValidateChirp(req: Request, res: Response) {
  const { body } = req.body ?? {};

  if (typeof body !== "string") {
    throw new BadRequestError("Invalid JSON");
  }

  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  } else {
    res.status(200).send({
      cleanedBody: cleanBody(body),
    });
  }
}

const cleanBody = (body: string) => {
  const parts = body.split(" ");

  const cleanedParts = parts.map((part) => {
    const normalizedWord = part.toLowerCase();

    if (badWords.includes(normalizedWord)) return "****";
    return part;
  });

  return cleanedParts.join(" ");
};
