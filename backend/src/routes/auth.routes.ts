import { Router } from "express";
import { createUserController } from "../controllers/create-user-controller";
import { authenticateUserController } from "../controllers/authenticate-user-controller";

const authRoutes = Router();

authRoutes.post("/register", createUserController);
authRoutes.post("/login", authenticateUserController);

export default authRoutes;