import { EventModel } from "../models/event.model.js";

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
        status: "draft",
        organizer
    });

    return newEvent;
}