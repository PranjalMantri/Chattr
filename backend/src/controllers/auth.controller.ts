import { Request, Response } from "express";

export const signup = (req: Request, res: Response): void => {
  res.send("Signup");
};

export const login = (req: Request, res: Response): void => {
  res.send("Login");
};

export const logout = (req: Request, res: Response): void => {
  res.send("Signout");
};
