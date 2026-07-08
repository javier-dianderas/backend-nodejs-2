import { Router } from "express";
import { getEvents, createEvent } from "../controllers/events.controller.js";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.middleware.js";

const router = Router();

router.get("/", getEvents);

router.post(
    "/", 
    passport.authenticate("current", {
        session: false
    }),
    authorizeRoles("admin", "organizer"),
    createEvent);

export default router;