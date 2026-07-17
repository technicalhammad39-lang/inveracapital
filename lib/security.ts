import { z } from 'zod';

// Strict input validation to prevent XSS and SQL injection
// Prisma parameterized queries automatically handle SQLi, 
// but zod ensures we don't accept malformed data.

export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  firstName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),
  lastName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),
});

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(1000000),
  currency: z.enum(["USD", "PKR", "GBP", "AED", "SAR"]),
  method: z.string().min(1).max(50),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000),
});

export function sanitizeHtml(input: string): string {
  // Basic HTML escape to prevent XSS
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
