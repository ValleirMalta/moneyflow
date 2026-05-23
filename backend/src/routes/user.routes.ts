import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMeController } from "../controllers/userController";

const router = Router();
router.get("/me", authMiddleware, getMeController);

export default router;