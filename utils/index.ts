import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const accountTypes = ['personal', 'business', 'admin'] as const;
export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'] as const;

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

export const transactionSchema = z.object({
  fromAccountId: z.string().min(1, "From Account is required"),
  toAccountId: z.string().min(1, "To Account is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
});

export const accountTypeColorsHex: Record<AccountType, string> = {
  personal: "#6b89ad",  // 
  business: "#7d9ac0",  // oklch(0.52 0.07 227.392)
  admin: "#8fabd2",     // oklch(0.6 0.07 227.392)
};

export const getSubjectColor = (subject: string) => {
  return accountTypeColorsHex[subject as keyof typeof accountTypeColorsHex];
};

export const exchangeRates: Record<string, number> = {
  USD: 1,      
  EUR: 0.92,   
  GBP: 0.81,
  JPY: 134.5,
  CAD: 1.34,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  if (!exchangeRates[from] || !exchangeRates[to]) {
    throw new Error("Unsupported currency");
  }

  // Convert amount to USD first, then to target currency
  const amountInUSD = amount / exchangeRates[from];
  const convertedAmount = amountInUSD * exchangeRates[to];
  return Number(convertedAmount.toFixed(2)); // Round to 2 decimals
}