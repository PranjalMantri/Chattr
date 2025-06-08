import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import roomRouter from "./routes/room";

export function createServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.use(cors());
  app.use(express.json());

  app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({ message: "Chattr server is runinng" });
  });

  app.use("/room", roomRouter);

  return httpServer;
}
