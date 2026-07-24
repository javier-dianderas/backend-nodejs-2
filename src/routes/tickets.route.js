import { Router } from "express";
import passport from "passport";
import { getTicketById, cancelTicket, getTicketsByUser } from "../controllers/tickets.controller.js";

const router = Router()

router.get(
    "/my-tickets",
    passport.authenticate("current", {
        session: false
    }),
    getTicketsByUser);

router.get(
    "/:tid", 
    passport.authenticate("current", {
        session: false
    }),
    getTicketById);

router.patch(
    "/:tid/cancel",
    passport.authenticate("current", {
        session: false
    }),
    cancelTicket);

export default router;