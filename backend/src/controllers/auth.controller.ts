import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/user.model.ts";
import { generateToken } from "../lib/utils.ts";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, fullName, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id as string, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }
  } catch (error) {
    console.log("Error in signin controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req: Request, res: Response): void => {
  res.send("Login");
};

export const logout = (req: Request, res: Response): void => {
  res.send("Signout");
};
