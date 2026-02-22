import express from "express";
import cors from "cors";
import { createServer } from "http";
import { setupSocket } from "./socket/index.js";
import { startDeadlineChecker } from "./jobs/deadlineChecker.js";
import { initTelegramBot } from "./services/telegram.service.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import checkinRoutes from "./routes/checkin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();
const httpServer = createServer(app);
const io = setupSocket(httpServer);

// Make io available to controllers
app.set("io", io);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Initialize Telegram Bot
  initTelegramBot();

  // Start cron jobs
  startDeadlineChecker(io);
});

export default app;
