import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        attendees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        status: {
            type: String,
            enum: ["scheduled", "cancelled", "completed"],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

eventSchema.pre(["find", "findOne"], function() {
    this.populate("organizer", "_id first_name last_name role");
});

export const EventModel = mongoose.model('Event', eventSchema);