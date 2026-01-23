import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors/errors.js";
import { upgradeUser } from "../../db/queries/users.js";

export async function handlerUpgradeUser(req: Request, res: Response) {
  const { event, userId } = validateRequest(req);

  if (event !== "user.upgraded") {
    res.sendStatus(204);
    return;
  }

  const user = await upgradeUser(userId);
  if (!user) throw new NotFoundError("user does not exist");

  res.sendStatus(204);
}

function validateRequest(req: Request) {
  if (!req.body || typeof req.body !== "object") {
    throw new BadRequestError("Request body must be an object");
  }

  const { event, data } = req.body as Record<string, unknown>;

  if (typeof event !== "string" || !data) {
    throw new BadRequestError("Malformed request body");
  }
  const { userId } = data as Record<string, unknown>;
  if (!userId || typeof userId !== "string") {
    throw new BadRequestError("No valid userId");
  }

  return { event, userId };
}
