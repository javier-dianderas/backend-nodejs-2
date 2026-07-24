import * as ticketsRepository from "../repositories/ticket.repository.js";
import * as eventsRepository from "../repositories/events.repository.js";
import { AppError } from "../errors/app.error.js";
import { sendTicketCancellationEmail, sendTicketConfirmationEmail } from "./mail.service.js";
import { generateTicketCode } from "../utils/ticket.js";
import { EventModel } from "../models/event.model.js";

export const getTicketById = async (ticketId) => {
    const ticket = await ticketsRepository.getTicketById(ticketId);
    return {
        id: ticket._id,
        user: {
            first_name: ticket.user.first_name,
            last_name: ticket.user.last_name,
            email: ticket.user.email,
        },
        event: ticket.event,
        status: ticket.status,
        quantity: ticket.quantity,
        code: ticket.code,
        cancelledAt: ticket.cancelledAt
    };
}

export const getTicketsByUser = async (userId) => {
    const tickets = await ticketsRepository.getTicketsByUser(userId);
    // TODO: falta renombrar
    return tickets;
}

export const getTicketsByEvent = async ({eventId, user}) => {

    const event = await EventModel.findById(eventId);
    if(!(event.organizer.equals(user.id) || user.role === "admin")) {
        throw new AppError("No tienes permisos para ver los tickets de este evento", 403);
    }

    const tickets = await ticketsRepository.getTicketsByEvent(eventId);
    // TODO: falta renombrar
    return tickets;
}

export const createTicket = async ({ userId, eventId, quantity, email, userName }) => {

    if(quantity <= 0) {
        throw new AppError("quantity debe ser mayor a 0", 400);
    }
    
    const event = await eventsRepository.getEventById(eventId);
    if(!event) {
        throw new AppError("No se encontró el evento", 400);
    }

    if(event.status !== "published") {
        throw new AppError("El evento no esta disponible para inscripciones", 400);
    }

    const now = new Date();
    if(event.start_date.getTime() < now.getTime()) {
        throw new AppError("No es posible inscribirse a un evento finalizado", 400);
    }

    const existingTicket = await ticketsRepository.getTicketByStatus({ userId, eventId, status: "active" });
    if(existingTicket) {
        throw new AppError("Ya tienes un ticket para este evento", 409);
    }
    
    const totalReserved = await ticketsRepository.getReservedCapacityByEvent(eventId);    
    const available = event.capacity - totalReserved;    
    if(quantity > available) {
        throw new AppError("No hay cupos suficientes", 400);
    }

    const reservationCode = generateTicketCode();
    const status = "active";
    const newTicket = await ticketsRepository.createTicket({ 
        user: userId, 
        event: eventId, 
        status, 
        quantity, 
        reservationCode });

    await sendTicketConfirmationEmail({
        to: email, 
        userName: userName, 
        eventTitle: event.title, 
        ticketCode: reservationCode
    });

    return {
        id: newTicket._id,
        user: newTicket.user,
        event: newTicket.event,
        status: newTicket.status,
        quantity: newTicket.quantity,
        reservationCode: newTicket.reservationCode,
        cancelledAt: newTicket.cancelledAt
    };
}

export const cancelTicket = async ({ ticketId, user }) => {
    const ticket = await ticketsRepository.getTicketById(ticketId);
    if(!ticket) {
        throw new AppError("No se encontró el ticket", 400);
    }

    if(ticket.status === "cancelled") {
        throw new AppError("El ticket ya está cancelado", 400);
    }
        
    const now = new Date();
    if(ticket.event.end_date.getTime() < now.getTime()) {
        throw new AppError("No se puede cancelar un ticket de un evento finalizado", 400);
    }

    if(!ticket.user._id.equals(user.id) && user.role !== "admin") {
        throw new AppError("No tienes permisos para cancelar este ticket", 400);
    }
    
    const status = "cancelled";
    const updatedTicket = await ticketsRepository.cancelTicket({
        ticketId,
        status,
        cancelledAt: now
    });

    await sendTicketCancellationEmail ({
        to: user.email, 
        userName: user.userName, 
        eventTitle: ticket.event.title, 
        ticketCode: ticket.reservationCode
    });
    
    return {
        id: updatedTicket._id,
        user: updatedTicket.user,
        event: updatedTicket.event,
        status: updatedTicket.status,
        quantity: updatedTicket.quantity,
        code: updatedTicket.code,
        cancelledAt: updatedTicket.cancelledAt
    }
}