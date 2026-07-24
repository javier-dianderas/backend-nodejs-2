import mongoose from "mongoose";
import { TicketModel } from "../models/ticket.model.js"

export const getTicketById = async (ticketId) => {
    const ticket = await TicketModel.findById(ticketId)
        .populate("user", "first_name last_name email")
        .populate("event", "title start_date end_date location")
        .lean();
    return ticket;
}

export const getTicketByStatus = async ({ userId, eventId, status}) => {
    const ticket = await TicketModel.findOne({
        user: userId,
        event: eventId,
        status: status
    }).lean();
    return ticket;
}

export const getTicketsByUser = async (userId) => {
    const tickets = await TicketModel.find({
        user: userId
    })
        .populate("user", "first_name last_name email")
        .populate("event", "title start_date end_date location").lean();
    return tickets;
}

export const getTicketsByEvent = async (eventId) => {
    const tickets = await TicketModel.find({
        event: eventId
    })
        .populate("user", "first_name last_name email")
        .populate("event", "title start_date end_date location").lean();
    return tickets;
}

export const getReservedCapacityByEvent = async (eventId) => {
    const result = await TicketModel.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(eventId),
                status: "active"
            }
        },
        {
            $group: {
                _id: "$event",
                totalReserved: {
                    $sum: "$quantity"
                }
            }
        }
    ]);

    const reserved = result[0]?.totalReserved || 0;
    return reserved;
}

export const createTicket = async ({ user, event, status, quantity, reservationCode}) => {
    const newTicket = await TicketModel.create({
        user,
        event,                
        status,
        quantity,
        reservationCode
    });
    await newTicket.populate([
        {
            path: "user",
            select: "first_name last_name email"
        },
        {
            path: "event",
            select: "title start_date end_date location"
        }
    ]);        
    return newTicket.toObject();
}

export const cancelTicket = async ({ ticketId, status, cancelledAt }) => {
    const updatedTicket = await TicketModel.findByIdAndUpdate(
        ticketId,
        {
            status: status,
            cancelledAt: cancelledAt
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    )
        .populate("user", "first_name last_name email")
        .populate("event", "title start_date end_date location").lean();
    return updatedTicket;
}