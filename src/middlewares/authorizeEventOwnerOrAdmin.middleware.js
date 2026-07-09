import mongoose from "mongoose";
import { EventModel } from "../models/event.model.js";

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    const { eventId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }

    const event = await EventModel.findById(eventId);

    if(!event) {
        return res.status(404).json({
            status: "error",
            message: "Evento no encontrado"
        });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = event.organizer._id.toString() === req.user._id.toString();

    if(!isAdmin && !isOwner) {
        res.status(403).json({
            status: "error",
            message: "No tienes permisos para modificar este evento"
        });
    };

    req.event = event;

    next();
}