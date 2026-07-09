import { Router } from "express";
import { getCurrentUser, login, loginResponse, logout, register, registerResponse, getCurrentUserResponse, getUsers } from "../controllers/sessions.controller.js";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = Router();

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

router.get(
    "/users",
    passport.authenticate("current", {
        session: false
    }),
    authorizeRoles("admin"),
    getUsers);

export default router;