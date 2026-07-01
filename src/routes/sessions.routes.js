import { Router } from "express";
import { getCurrentUser, login, loginResponse, logout, register, registerResponse, getCurrentUserResponse } from "../controllers/sessions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

// router.post("/register", register);
// router.post("/login", login);
// router.get("/current", authMiddleware, getCurrentUser);

router.post(
    "/register",
    passport.authenticate("register", {
        session: false
    }),
    registerResponse
);

router.post(
    "/login",
    passport.authenticate("login", {
        session: false
    }),
    loginResponse
);

router.get(
    "/current",
    passport.authenticate("current", {
        session: false
    }),
    getCurrentUserResponse
)

router.post(
    "/logout", 
    passport.authenticate("current", {
        session: false
    }),
    logout);

export default router;