import { connectDB } from "./config/database.js";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import eventsRouter from "./routes/events.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/env.js";
import "./config/passport.config.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

connectDB();

app.use('/api/health', healthRoutes);
app.use("/api/sessions", sessionsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

app.use(errorHandlerMiddleware);

export default app;