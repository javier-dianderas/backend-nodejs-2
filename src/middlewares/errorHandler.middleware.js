import mongoose from "mongoose";
import { AppError } from "../errors/app.error.js";

export default (err, req, res, next) => {    
    console.log(err);
    // Error de negocio
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message
        });
    }

    // Error de validación de Mongoose
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            status: "error",
            message: err.message
        });
    }

    // Id con formato inválido
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            status: "error",
            message: `Id inválido: ${err.message}`
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Error interno del servidor"
    });
}