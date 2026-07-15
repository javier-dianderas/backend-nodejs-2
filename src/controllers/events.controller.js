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

    const filter = {};

    if(category) {
        filter.category = category;
    }

    if(status) {
        filter.status = status;
    }

    if(location) {
        filter.location = {
            $regex: location,
            $options: "i"
        }
    }

    if(fromDate || toDate) {
        filter.date = {};

        if(fromDate) {
            filter.date.$gte = new Date(fromDate);
        }

        if(toDate) {
            filter.date.$lte = new Date(toDate);
        }
    }

    if(search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Math.min(Number(limit) || 10, 50);
    const skip = (pageNumber - 1) * limitNumber;
    
    const events = await EventModel
        .find(filter)
        .populate("category")
        .populate("organizer", "first_name last_name email")
        .sort(sort)
        .skip(skip)
        .limit(limitNumber);
    
    const totalEvents = await EventModel.countDocuments(filter);

    res.status(200).json({
        status: "success",
        payload: events,
        pagination: {
            total: totalEvents,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalEvents / limitNumber)
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

    const event = await EventModel.findById(eventId);

    if(!event) {
        return res.status(404).json({
            status: "error",
            message: "No se encontró el evento"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Evento encontrado",
        payload: {
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            start_date: event.start_date,
            end_date: event.end_date,
            capacity: event.capacity,
            price: event.price,
            organizer: event.organizer,
            attendees: event.attendees,
            status: event.status,
        }
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

    const start = new Date(start_date);
    const end = new Date(end_date);

    if(start.getTime() >= end.getTime()) {
        return res.status(400).json({
            status: "error",
            message: "start_date debe ser menor a end_date"
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
        organizer: req.user._id 
    });

    res.status(201).json({
        status: "success",
        message: "Evento registrado correctamente",
        payload: newEvent
    });
}

export const updateEvent = async (req, res) => {

    const { eventId } = req.params;
    const { title, description, location, start_date, end_date, capacity, price, status } = req.body;

    if(!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({
            status: "error",
            message: "El id no es válido"
        });
    }

    if(!title || !description || !location || !start_date || !end_date || capacity === undefined || price === undefined || !status) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if(start.getTime() >= end.getTime()) {
        return res.status(400).json({
            status: "error",
            message: "start_date debe ser menor a end_date"
        });
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
        eventId, 
        {
            title,
            description,
            location,
            start_date,
            end_date,
            capacity,
            price,
            status
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: "success",
        message: "Evento actualizado correctamente",
        payload: {
            id: updatedEvent.id,
            title: updatedEvent.title,
            description: updatedEvent.description,
            location: updatedEvent.location,
            start_date: updatedEvent.start_date,
            end_date: updatedEvent.end_date,
            capacity: updatedEvent.capacity,
            price: updatedEvent.price,
            organizer: updatedEvent.organizer ,
            attendees: updatedEvent.attendees,
            status: updatedEvent.status,
        }
    });
}