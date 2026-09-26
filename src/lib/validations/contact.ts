import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  // Honeypot field for bot/spam prevention - must be empty
  website: z.string().max(0, "Bot detected").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
