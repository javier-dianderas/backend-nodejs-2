import * as eventsRepository from "../repositories/events.repository.js";
import { AppError } from "../errors/app.error.js";

export const getEvents = async ({ category, status, location, fromDate, toDate, search, page = 1, limit = 10, sort = "date" }) => {
    
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
        filter.start_date = {};

        if(fromDate) {
            filter.start_date.$gte = new Date(fromDate);
        }

        if(toDate) {
            filter.start_date.$lte = new Date(toDate);
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

    const { events, totalEvents } = await eventsRepository.getEvents({ filter, sort, skip, limitNumber});
    const totalPages = Math.ceil(totalEvents / limitNumber);

    return { events, totalEvents, pageNumber, limitNumber, totalPages };
}

export const getEventById = async (eventId) => {

    const event = await eventsRepository.getEventById(eventId);
    if(!event) {
        throw new AppError("No se encontró el evento", 404);
    }
    return {
        id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        status: event.status,
        organizer: event.organizer
    };
}

export const createEvent = async ({ title, description, category, start_date, end_date, location, capacity, price, userId }) => {
    
    //Se valida que el start_date no sea menor a la fecha actual
    const start = new Date(start_date);
    const now = new Date();    
    if(start.getTime() < now.getTime()) {
        throw new AppError("start_date no debe ser menor a la fecha/hora actual", 400);
    }

    //Se valida que el stat_date sea menor que el end_date    
    const end = new Date(end_date);
    if(start.getTime() >= end.getTime()) {
        throw new AppError("start_date debe ser menor a end_date", 400);
    }

    //Se valida que capacity sea mayor a 0
    if(capacity <= 0) {
        throw new AppError("capacity debe ser mayor a 0", 400);
    }

    //Se valida que price sea mayor o igual a 0
    if(price < 0) {
        throw new AppError("price debe ser mayor o igual a 0", 400);
    }

    const status = "draft";
    const organizer = userId;
    const newEvent = await eventsRepository.createEvent({ title, description, category, start_date, end_date, location, capacity, price, status, organizer });
    return {
        id: newEvent._id,
        title: newEvent.title,
        description: newEvent.description,
        category: newEvent.category,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date,
        location: newEvent.location,
        capacity: newEvent.capacity,
        price: newEvent.price,
        status: newEvent.status,
        organizer: newEvent.organizer
    };
}

export const updateEvent = async ({ eventId, title, description, category, start_date, end_date, location, capacity, price, status, user }) => {

    //Se valida que el evento exista
    const event = await eventsRepository.getEventById(eventId);
    if(!event) {
        throw new AppError("No se encontró el evento", 404);
    }

    //Se valida que el start_date no sea menor a la fecha actual
    const start = new Date(start_date);
    const now = new Date();    
    if(start.getTime() < now.getTime()) {
        throw new AppError("start_date no debe ser menor a la fecha/hora actual", 400);
    }

    //Se valida que el stat_date sea menor que el end_date    
    const end = new Date(end_date);
    if(start.getTime() >= end.getTime()) {
        throw new AppError("start_date debe ser menor a end_date", 400);
    }

    //Se valida que capacity sea mayor a 0
    if(capacity <= 0) {
        throw new AppError("capacity debe ser mayor a 0", 400);
    }

    //Se valida que price sea mayor o igual a 0
    if(price < 0) {
        throw new AppError("price debe ser mayor o igual a 0", 400);
    }

    //Se valida que el usuario tenga rol admin o sea organizer del evento
    console.log("event.organizer", event.organizer);
    if(!(user.role === "admin" || (user.role === "organizer" && event.organizer.equals(user.id)))) {
        throw new AppError("No tiene permiso para modificar el evento", 400);
    }

    //Se valida que el usuario tenga rol admin para modificar un evento cancelado
    if(event.status === "cancelled" && user.role !== "admin") {
        throw new AppError("No tiene permiso para modificar un evento cancelado", 400);
    }
    console.log("event", event); 
    //Se valida que no se pueda publicar un evento finalizado o cancelado
    if(event.status !== "draft" && event.status === "published") {
        throw new AppError("No se puede publicar un evento finalizado o cancelado", 400);
    }
    //No se puede actualizar el organizer
    
    const updatedEvent = await eventsRepository.updateEvent({ eventId, title, description, category, start_date, end_date, location, capacity, price, status });
    return {
        id: updatedEvent._id,
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
    };
}