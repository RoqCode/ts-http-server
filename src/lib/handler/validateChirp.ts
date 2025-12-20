import { Request, Response } from "express";

const badWords = ["kerfuffle", "sharbert", "fornax"];

export function handlerValidateChirp(req: Request, res: Response) {
  const { body } = req.body ?? {};

  if (typeof body !== "string") {
    throw new Error("Invalid JSON");
  }

  if (body.length > 140) {
    throw new Error("Chirp is too long");
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
