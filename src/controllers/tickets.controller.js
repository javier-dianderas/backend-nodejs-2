import mongoose from "mongoose";
import * as ticketsService from "../services/ticket.service.js";

export const getTicketById = async (req, res) => {

    const { tid } = req.params;

    if(!mongoose.Types.ObjectId.isValid(tid)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }

    const ticket = await ticketsService.getEventById(tid);

    res.status(200).json({
        status: "success",
        message: "Evento encontrado",
        payload: ticket
    });
}

export const getTicketsByUser = async (req, res) => {

    console.log(req.user);
    const tickets = await ticketsService.getTicketsByUser(req.user.id);

    res.status(200).json({
        status: "success",
        payload: tickets
    });
}

export const getTicketsByEvent = async (req, res) => {
    
    const { eid } = req.params;
    const tickets = await ticketsService.getTicketsByEvent({
        eventId: eid,
        user: {
            id: req.user._id,
            role: req.user.role
        }
    });

    res.status(200).json({
        status: "success",
        payload: tickets
    });
}

export const createTicket = async (req, res) => {

    const { eid } = req.params;
    const { quantity } = req.body;

    if(!mongoose.Types.ObjectId.isValid(eid)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }

    if(quantity === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        });
    }
    
    const newEvent = await ticketsService.createTicket({ 
        userId: req.user._id, 
        eventId: eid, 
        quantity,
        email: req.user.email,
        userName: req.user.first_name
    });

    res.status(201).json({
        status: "success",
        message: "Ticket registrado correctamente",
        payload: newEvent
    });
}

export const cancelTicket = async (req, res) => {

    const { tid } = req.params;

    if(!mongoose.Types.ObjectId.isValid(tid)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }
    
    const updatedTicket = await ticketsService.cancelTicket({
        ticketId: tid, 
        user: {
            id: req.user._id,
            role: req.user.role,
            email: req.user.email,
            userName: req.user.first_name
        }
    });

    res.status(201).json({
        status: "success",
        message: "Ticket cancelado correctamente",
        payload: updatedTicket
    });
}