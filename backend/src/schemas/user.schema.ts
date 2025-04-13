import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    fullName: z.string(),
    profilePic: z.string().optional(),
    password: z.string().min(6),
  }),
});
