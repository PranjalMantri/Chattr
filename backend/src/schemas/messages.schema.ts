import { z } from "zod";

export const getMessagesSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const sendMessage = z.object({
  body: z.object({
    text: z.string().optional(),
    image: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
