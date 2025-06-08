import { Router, Request, Response } from "express";

const app = Router();

const rooms = new Map<
  string,
  {
    participants: Set<string>;
    chatHistory: Array<{
      username: string;
      message: string;
      timestamp: Date;
    }>;
  }
>();

app.post("/join", (req: Request, res: Response) => {
  try {
    const { username, roomId } = req.body;

    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    if (!roomId) {
      res.status(400).json({ error: "Room ID is required" });
      return;
    }

    const room = rooms.get(roomId);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    room.participants.add(username);

    res.status(200).json({
      message: `User ${username} joined room ${roomId}`,
      room: {
        ...room,
        participants: Array.from(room.participants),
      },
    });
  } catch (err) {
    console.error("Error in /join:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/leave", (req: Request, res: Response) => {
  try {
    const { roomId, username } = req.body;

    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    const room = rooms.get(roomId);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    room.participants.delete(username);

    if (room.participants.size == 0) {
      rooms.delete(roomId);
    }

    res.status(200).json({
      message: `Left room ${roomId}`,
    });
  } catch (err) {
    console.error("Error in /leave:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/create", (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    let roomId;
    do {
      roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (rooms.has(roomId));

    const newRoom = {
      participants: new Set([username]),
      chatHistory: [],
    };
    rooms.set(roomId, newRoom);

    res.status(200).json({
      message: "Room created successfully",
      roomId,
      room: {
        ...newRoom,
        participants: Array.from(newRoom.participants),
      },
    });
  } catch (err) {
    console.error("Error in /create:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  try {
    const availableRooms = Array.from(rooms.entries()).map(
      ([roomId, room]) => ({
        roomId,
        participants: Array.from(room.participants),
        chatHistory: room.chatHistory,
      })
    );

    res.status(200).json({ availableRooms });
  } catch (err) {
    console.error("Error in / (list rooms):", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/message", (req: Request, res: Response) => {
  try {
    const { roomId, username, message } = req.body;

    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    if (!roomId) {
      res.status(400).json({ error: "Room ID is required" });
      return;
    }

    if (!message || message.trim() === "") {
      res.status(400).json({ error: "Message cannot be empty" });
      return;
    }

    const room = rooms.get(roomId);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    if (!room.participants.has(username)) {
      res.status(403).json({ error: "User is not a part of this room" });
      return;
    }

    room.chatHistory.push({
      username,
      message,
      timestamp: new Date(),
    });

    res.status(200).json({
      message: "Message sent",
    });
  } catch (err) {
    console.error("Error in /message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/chat/:roomId", (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;

    const room = rooms.get(roomId);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.status(200).json({ chatHistory: room.chatHistory });
  } catch (err) {
    console.error("Error in /chat/:roomId:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
