import { EventModel } from "../models/event.model.js";

export const getEvents = async ({ filter, sort, skip, limitNumber}) => {

    const events = await EventModel
        .find(filter)
        .populate("category")
        .populate("organizer", "first_name last_name email")
        .sort(sort)
        .skip(skip)
        .limit(limitNumber);
        
    const totalEvents = await EventModel.countDocuments(filter);

    return { events, totalEvents };
}

export const getEventById = async (eventId) => {
    const event = await EventModel.findById(eventId);
    return event;
}

export const createEvent = async ({ title, description, category, start_date, end_date, location, capacity, price, status, organizer }) => {

    const newEvent = await EventModel.create({
        title,
        description,
        category,        
        start_date,
        end_date,
        location,
        capacity,
        price,
        status,
        organizer
    });

    return newEvent;
}

export const updateEvent = async ({ eventId, title, description, category, start_date, end_date, location, capacity, price, status }) => {

    const updatedEvent = await EventModel.findByIdAndUpdate(
        eventId, 
        {
            title,
            description,
            category,
            start_date,
            end_date,
            location,
            capacity,
            price,
            status
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    return updatedEvent;
}