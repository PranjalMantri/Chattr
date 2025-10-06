import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chattr-hazel.vercel.app"],
  },
});

const userSockets = new Map<string, Set<string>>();

export function getReceiverSocketIds(userId: string): string | undefined {
  const sockets = userSockets.get(userId);

  if (sockets && sockets.size > 0) {
    return sockets.values().next().value;
  }
  return undefined;
}

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set<string>());
    }

    userSockets.get(userId)!.add(socket.id);

    io.emit("getOnlineUsers", Array.from(userSockets.keys()));
  }

  socket.on("disconnect", () => {
    if (userId && userSockets.has(userId)) {
      const userConnections = userSockets.get(userId)!;
      userConnections.delete(socket.id);

      if (userConnections.size === 0) {
        userSockets.delete(userId);
      }
    }

    io.emit("getOnlineUsers", Array.from(userSockets.keys()));
  });
});

export { io, app, server };
