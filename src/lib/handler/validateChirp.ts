import { BadRequestError } from "../errors/errors.js";

const badWords = ["kerfuffle", "sharbert", "fornax"];

export function handlerValidateChirp(body: string) {
  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  } else {
    return { cleanedBody: cleanBody(body) };
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
