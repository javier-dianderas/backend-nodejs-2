import * as categoryRepository from "../repositories/categories.repository.js";

export const createCategory = async ({ name }) => {
    const newCategory = await categoryRepository.createCategory({ name });
    return {
        id: newCategory.id,
        name: newCategory.name
    };
}