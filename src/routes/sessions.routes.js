import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/sessions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logout);

export default router;