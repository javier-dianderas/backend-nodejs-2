import * as categoryService from "../services/categories.service.js";

export const createCategory = async (req, res) => {

    const { name } = req.body;

    if(!name) {
        return res.status(400).json({
            status: "error",
            message: "Todos los campos son obligatorios"
        });
    }    

    const newCategory = await categoryService.createCategory({ name });

    res.status(201).json({
        status: "success",
        message: "Categoría registrada correctamente",
        payload: newCategory
    });
}