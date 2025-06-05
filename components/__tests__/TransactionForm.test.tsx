import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionForm from "@/components/TransactionForm";
import { CreateTransactionPayload } from "@/lib/types";
import * as api from "@/lib/api";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import { Currency } from "@/lib";

window.HTMLElement.prototype.hasPointerCapture = () => false;
// Mock `createTransaction` API
jest.mock("../../lib/api", () => ({
  createTransaction: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "labels.fromAccount": "From Account",
      "labels.toAccount": "To Account",
      "labels.amount": "Amount",
      "labels.description": "Description",
      "labels.convertedAmount": "Converted Amount",
      "placeholders.amount": "Enter amount",
      "placeholders.description": "Enter description",
      "buttons.submit": "Submit",
      "buttons.processing": "Processing...",
      "errors.failedToCreate": "Failed to create transaction",
    };
    return translations[key] ?? key;
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(), // You can also test if it was called
  }),
}));

const mockAccounts = [
  {
    id: "acc-1",
    name: "Main Account",
    currency: "USD" as Currency,
    ownerName: "Alice",
  },
  {
    id: "acc-2",
    name: "Savings Account",
    currency: "EUR" as Currency,
    ownerName: "Bob",
  },
];

describe("TransactionForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<TransactionForm accounts={mockAccounts} />);
    expect(screen.getByLabelText(/From Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });
});
