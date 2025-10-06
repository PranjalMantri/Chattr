import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRouter from "./routes/auth.route.js";
import messagesRouter from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://chattr-hazel.vercel.app/",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
