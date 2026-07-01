import { connectDB } from "./config/database.js";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import eventsRouter from "./routes/events.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/api/health', healthRoutes);
app.use('/api/events', eventsRouter);

export default app;