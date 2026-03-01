import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(5000),
  author: z.string().min(1, "Author is required").max(100),
});
