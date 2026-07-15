import * as eventsRepository from "../repositories/events.repository.js";

export const createEvent = async ({ title, description, category, start_date, end_date, location, capacity, price, organizer }) => {
    const status = "draft";
    const newEvent = await eventsRepository.createEvent({ title, description, category, start_date, end_date, location, capacity, price, status, organizer });
    return {
        id: newEvent._id,
        title: newEvent.title,
        description: newEvent.description,
        category: newEvent.description,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date,
        location: newEvent.location,
        capacity: newEvent.capacity,
        price: newEvent.price,
        organizer: newEvent.organizer,
        status: newEvent.status
    };
}