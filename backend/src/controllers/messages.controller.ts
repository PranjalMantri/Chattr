import { Request, Response } from "express";
import User from "../models/user.model.ts";
import Message from "../models/message.model.ts";
import cloudinary from "../lib/cloudinary.ts";
import { getReceiverSocketId, io } from "../lib/socket.ts";

interface CustomRequest extends Request {
  user?: any;
}

export const getAllUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const loggedInUser = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Something went wrong in getAllUsers controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Something went wrong in getMessages controller: ", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;

    let imageUrl = null;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Something went wrong in sendMessage controller: ", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};
