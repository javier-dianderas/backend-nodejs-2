import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export const CategoryModel = new mongoose.model("Category", categorySchema);