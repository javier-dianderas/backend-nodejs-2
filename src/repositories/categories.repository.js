import { CategoryModel } from "../models/category.model.js";

export const createCategory = async ({ name }) => {

    const newCategory = await CategoryModel.create({
        name
    });

    return newCategory;
}