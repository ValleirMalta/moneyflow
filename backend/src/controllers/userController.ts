import { Request, Response } from "express";
import { getUserById } from "../services/userService";

export async function getMeController(req: Request, res: Response) {
  const user = await getUserById(req.userId!);

  return res.json(user);
}