import { connectDB } from "./config/database.js";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import usersRouter from "./routes/users.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import eventsRouter from "./routes/events.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/api/health', healthRoutes);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tickets', ticketsRouter);

export default app;