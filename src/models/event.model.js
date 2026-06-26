import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        start_time: {
            type: Date,
            required: true
        },
        end_time: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const EventModel = mongoose.model('Event', eventSchema);