import { z } from "zod";

export const getMessagesSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
