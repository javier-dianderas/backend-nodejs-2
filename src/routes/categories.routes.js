import { Router } from "express";
import passport from "passport";
import { createCategory } from "../controllers/categories.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = Router();

router.post(
    "/",
    passport.authenticate("current", {
        session: false
    }),
    authorizeRoles("admin"),
    createCategory);

export default router;