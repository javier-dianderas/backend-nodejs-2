import { Router } from "express";
import { getEvents, getEventById, createEvent, updateEvent } from "../controllers/events.controller.js";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.middleware.js";
import { createTicket, getTicketsByEvent } from "../controllers/tickets.controller.js";

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

router.post(
    "/:eid/tickets",
    passport.authenticate("current", {
        session: false
    }),
    createTicket);

router.get(
    "/:eid/tickets",
    passport.authenticate("current", {
        session: false
    }),
    getTicketsByEvent
)

export default router;