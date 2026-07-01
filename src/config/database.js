import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Base de datos conectada");
    } catch(error) {
        console.log("Error al conectar a Mongo DB", error);
    }
}