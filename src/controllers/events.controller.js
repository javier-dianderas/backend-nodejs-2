import mongoose from "mongoose";
import { EventModel } from "../models/event.model.js";
import * as eventsService from "../services/events.service.js";

export const getEvents = async (req, res) => {

    const {
        category,
        status,
        location,
        fromDate,
        toDate,
        search,
        page = 1,
        limit = 10,
        sort = "date"
    } = req.query;
    
    const { events, totalEvents, pageNumber, limitNumber, totalPages } = await eventsService.getEvents({ category, status, location, fromDate, toDate, search, page, limit, sort });

    res.status(200).json({
        status: "success",
        payload: events,
        pagination: {
            total: totalEvents,
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages
        }
    });
}

export const getEventById = async (req, res) => {

    const { eventId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }

    const event = await eventsService.getEventById(eventId);

    res.status(200).json({
        status: "success",
        message: "Evento encontrado",
        payload: event
    });
}

export const createEvent = async (req, res) => {

    const { title, description, category, start_date, end_date, location, capacity, price } = req.body;

    if(!title || !description || !category || !start_date || !end_date || !location || capacity === undefined || price === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        });
    }
    
    const newEvent = await eventsService.createEvent({ 
        title, 
        description, 
        category, 
        start_date, 
        end_date, 
        location, 
        capacity, 
        price,
        userId: req.user._id 
    });

    res.status(201).json({
        status: "success",
        message: "Evento registrado correctamente",
        payload: newEvent
    });
}

export const updateEvent = async (req, res) => {

    const { eventId } = req.params;
    const { title, description, category, start_date, end_date, location, capacity, price, status } = req.body;

    if(!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }

    if(!title || !description || !category || !start_date || !end_date || !location || capacity === undefined || price === undefined || !status) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        });
    }

    const updatedEvent = await eventsService.updateEvent({ 
        eventId,
        title, 
        description, 
        category, 
        start_date, 
        end_date, 
        location, 
        capacity, 
        price,
        status,
        user: {
            id: req.user._id,
            role: req.user.role
        }
    });

    res.status(200).json({
        status: "success",
        message: "Evento actualizado correctamente",
        payload: {
            id: updatedEvent.id,
            title: updatedEvent.title,
            description: updatedEvent.description,
            category: updatedEvent.category,
            start_date: updatedEvent.start_date,
            end_date: updatedEvent.end_date,
            location: updatedEvent.location,
            capacity: updatedEvent.capacity,
            price: updatedEvent.price,
            status: updatedEvent.status,
            organizer: updatedEvent.organizer
        }
    });
}