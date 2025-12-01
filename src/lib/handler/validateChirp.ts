import { Request, Response } from "express";

const badWords = ["kerfuffle", "sharbert", "fornax"];

export function handlerValidateChirp(req: Request, res: Response) {
  try {
    const { body } = req.body ?? {};

    if (typeof body !== "string") {
      res.status(400).send("Invalid JSON");
      return;
    }

    if (body.length > 140) {
      res.status(400).send({
        error: "Chirp is too long",
      });
    } else {
      res.status(200).send({
        cleanedBody: cleanBody(body),
      });
    }
  } catch (error) {
    res.status(400).send("Invalid JSON");
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
