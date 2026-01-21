import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { config } from "../config.js";
import { getUserFromRefreshToken } from "../util/getUserFromToken.js";

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);

  const user = await getUserFromRefreshToken(token);

  const jwt = makeJWT(user.id, 3600, config.jwtSecret);

  res.status(200).send({ token: jwt });
}
