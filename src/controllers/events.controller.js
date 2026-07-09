import mongoose from "mongoose";
import { EventModel } from "../models/event.model.js";

export const getEvents = async (req, res) => {
    
    const events = await EventModel
        .find()
        .select("title description location start_date end_date capacity price status updatedAt");

    res.status(200).json({
        status: "success",
        payload: events
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

    const { title, description, location, start_date, end_date, capacity, price } = req.body;

    if(!title || !description || !location || !start_date || !end_date || capacity === undefined || price === undefined) {
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

    const newEvent = await EventModel.create({
        title,
        description,
        location,
        start_date,
        end_date,
        capacity,
        price,
        organizer: req.user._id
    });

    res.status(201).json({
        status: "success",
        message: "Evento registrado correctamente",
        payload: {
            id: newEvent.id,
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            start_date: newEvent.start_date,
            end_date: newEvent.end_date,
            capacity: newEvent.capacity,
            price: newEvent.price,
            organizer: newEvent.organizer ,
            attendees: newEvent.attendees,
            status: newEvent.status,
        }
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