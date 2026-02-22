import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    socket.on("join:project", (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("leave:project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on("join:dashboard", () => {
      socket.join("dashboard");
    });

    socket.on("join:user", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}
