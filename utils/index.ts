import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const accountTypes = ['personal', 'business', 'admin'] as const;
export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'] as const;

// TypeScript types derived from the above
export type AccountType = typeof accountTypes[number];
export type Currency = typeof currencies[number];

export const accountFormSchema = z.object({
   id: z.string().uuid().optional(),      
  ownerId: z.string().uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(accountTypes as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Invalid account type" }),
  }),
  currency: z.enum(currencies as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Invalid currency" }),
  }),
  ownerEmail: z.string().email("Invalid email").optional(),
  ownerName: z.string().min(3, "Contact name must be at least 3 characters").optional(),
  balance: z.string().min(1, "Balance must be non-negative"),
});