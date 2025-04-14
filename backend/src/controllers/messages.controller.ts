import { Request, Response } from "express";
import User from "../models/user.model.ts";

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
