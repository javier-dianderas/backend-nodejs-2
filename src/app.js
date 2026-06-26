import { connectDB } from "./config/database";
import express from express;
import healthRoutes from "./routes/health.routes";
import usersRouter from "./routes/users.routes";
import sessionsRouter from "./routes/sessions.routes";
import eventsRouter from "./routes/events.routes";
import ticketsRouter from "./routes/tickets.routes";

const app = express();

app.use(express.json());

connectDB();

app.use('/', healthRoutes);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tickets', ticketsRouter);

export default app;