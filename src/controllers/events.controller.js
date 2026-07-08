import { EventModel } from "../models/event.model.js";

export const getEvents = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            payload: []
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener eventos"
        });
    }
}

export const createEvent = async (req, res) => {

    const { title, description, location, start_date, end_date, capacity, price } = req.body;

    if(!title || !description || !location || !start_date || !end_date) {
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