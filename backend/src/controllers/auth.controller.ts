import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/user.model.ts";
import { generateToken } from "../lib/utils.ts";
import cloudinary from "../lib/cloudinary.ts";

interface CustomRequest extends Request {
  user?: any;
}

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
    }
  } catch (error) {
    console.log("Error in signin controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      res.status(404).json({ message: "Invalid credentials" });
      return;
    }

    generateToken(existingUser._id as string, res);

    res.status(201).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Successfuly logged out user" });
  } catch (error) {
    console.log("Error in logout controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { profilePic } = req.body;
  try {
    const userId = req.user._id;

    const uploadedImage = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadedImage.secure_url,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.log("Something went wrong in update profile controller: ", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};
