import { Router } from "express";
import { getEvents, getEventById, createEvent, updateEvent } from "../controllers/events.controller.js";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.middleware.js";

const router = Router();

router.get("/", getEvents);

router.get(
    "/:eventId",
    passport.authenticate("current", {
        session: false
    }),
    getEventById);

router.post(
    "/", 
    passport.authenticate("current", {
        session: false
    }),
    authorizeRoles("admin", "organizer"),
    createEvent);

router.put(
    "/:eventId",
    passport.authenticate("current", {
        session: false
    }),
    authorizeRoles("admin", "organizer"),
    authorizeEventOwnerOrAdmin,
    updateEvent);

export default router;