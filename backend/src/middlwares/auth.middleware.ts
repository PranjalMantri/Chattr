import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import User from "../models/user.model.ts";

interface CustomRequest extends Request {
  user?: any;
}

export const protectedRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(400).json({ message: "Unauthorized request" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res.status(400).json({ message: "Unauthorized request" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
