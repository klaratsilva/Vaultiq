import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { Account } from "./types";

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

export const extendedTransactionSchema = z.object({
  fromAccountId: z.string().min(1, "From Account is required"),
  toAccountId: z.string().min(1, "To Account is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  currency: z.string().min(1, "Currency is required"),
  targetCurrency: z.string().min(1, "Target Currency is required"),
  clientConvertedAmount: z
    .number({ invalid_type_error: "Converted amount must be a number" })
    .positive("Converted amount must be greater than 0"),
});

export const accountTypeColorsHex: Record<AccountType, string> = {
  personal: "#6b89ad",  
  business: "#7d9ac0",  
  admin: "#8fabd2",    
};

export const getTypeColor = (subject: string) => {
  return accountTypeColorsHex[subject as keyof typeof accountTypeColorsHex];
};
export const exchangeRates: Record<string, number> = {
  USD: 1,      
  EUR: 0.92,   
  GBP: 0.81,
  JPY: 134.5,
  CAD: 1.34,
};


export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  exchangeRates: Record<string, number>
): number {
  
   if (!exchangeRates || !exchangeRates[from] || !exchangeRates[to]) {
    throw new Error(`Unsupported currency: ${from} or ${to} not found in exchange rates.`);
  }

  const amountInUSD = amount / exchangeRates[from];
  const convertedAmount = amountInUSD * exchangeRates[to];
  return Number(convertedAmount.toFixed(2));
}

export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", dateTimeOptions);
};


  export const statusStyles = {
    active: {
      borderColor: "border-green-300",
      backgroundColor: "bg-green-500",
      textColor: "text-green-700",
      chipBackgroundColor: "bg-green-100",
    },
    inactive: {
      borderColor: "border-gray-300",
      backgroundColor: "bg-gray-500",
      textColor: "text-gray-700",
      chipBackgroundColor: "bg-gray-100",
    },
    pending: {
      borderColor: "border-yellow-300",
      backgroundColor: "bg-yellow-400",
      textColor: "text-yellow-800",
      chipBackgroundColor: "bg-yellow-100",
    },
    suspended: {
      borderColor: "border-red-300",
      backgroundColor: "bg-red-500",
      textColor: "text-red-700",
      chipBackgroundColor: "bg-red-100",
    },
    default: {
      borderColor: "border-neutral-300",
      backgroundColor: "bg-neutral-400",
      textColor: "text-neutral-700",
      chipBackgroundColor: "bg-neutral-100",
    },
  };

type PartialAccount = Partial<Account>;

export function formatAccountOptions(accounts: PartialAccount[]) {
  return accounts.map(({ id, name, currency, ownerName }) => ({
    value: id ?? "",
    label: `${name ?? "Unknown"} - ${currency ?? "-"} - ${ownerName ?? "-"}`,
  }));
}
