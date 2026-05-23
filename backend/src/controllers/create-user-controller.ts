import { Request, Response } from "express";
import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt";

export async function createUserController(
  request: Request,
  response: Response
) {
    const { name, email, password } = request.body;

    const userAlreadyExists = await prisma.user.findUnique({
    where: {
        email,
    },
    });

    if (userAlreadyExists) {
        return response.status(400).json({
        error: "Email already exists",
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data:{
            name,
            email,
            password: passwordHash,
        }
    })

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);

}