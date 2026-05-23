import { Request, Response } from "express";
import { authenticateUser } from "../services/authService";

export async function authenticateUserController(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const result = await authenticateUser(email, password);

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
    });
  }
}