import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import vetRoutes from "./routes/vetRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Raw HTTP access log (guidelines: logging). "dev" shows method/path/status
// in color; "combined" is the production-grade format (client IP, refs).
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/vets", vetRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/audit", auditRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
