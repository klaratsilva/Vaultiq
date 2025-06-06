import { render, screen } from "@testing-library/react";
import TransactionsTable from "../TransactionTable";
import { Transaction, Account } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { AccountType } from "@/lib/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockAccounts: Record<string, Account> = {
  "acc-1": {
    id: "acc-1",
    name: "Main Account",
    ownerName: "Alice",
    type: "checking" as AccountType,
    currency: "USD",
    ownerId: "234",
    ownerEmail: "alice@alice.com",
    balance: "300",
  },
  "acc-2": {
    id: "acc-2",
    name: "Savings",
    ownerName: "Bob",
    type: "savings" as AccountType,
    currency: "USD",
    ownerId: "234",
    ownerEmail: "bob@bob.com",
    balance: "300",
  },
};

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    fromAccountId: "acc-1",
    toAccountId: "acc-2",
    amount: 100,
    currency: "USD",
    status: "pending",
    createdAt: "2023-11-01T12:00:00.000Z",
    description: "Payment for groceries",
    targetCurrency: "USD",
    clientConvertedAmount: 100,
  },
  {
    id: "tx-2",
    fromAccountId: "unknown-id",
    toAccountId: "acc-1",
    amount: 200,
    currency: "EUR",
    status: "pending",
    createdAt: "2023-11-02T14:00:00.000Z",
    description: "Subscription payment",
    targetCurrency: "USD",
    clientConvertedAmount: 100,
  },
];

describe("TransactionsTable", () => {
  beforeEach(() => {
    render(
      <TransactionsTable
        transactions={mockTransactions}
        accountsMap={mockAccounts}
      />
    );
  });

  it("renders table headers", () => {
    expect(screen.getByText(/fromAccountHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/toAccountHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/amountHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/statusHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/dateHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/descriptionHeader/i)).toBeInTheDocument();
  });

  it("renders all transactions", () => {
    const rows = screen.getAllByRole("row");
    // 1 header row + 2 transactions
    expect(rows.length).toBe(3);
  });

  it("renders 'loading account' if account ID is not found", () => {
    expect(screen.getByText(/loadingAccount/i)).toBeInTheDocument();
  });

  it("renders correct amount and currency", () => {
    expect(screen.getByText("100 USD")).toBeInTheDocument();
    expect(screen.getByText("200 EUR")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    expect(screen.queryAllByText("pending").length).toBeGreaterThan(0);
  });

  it("renders formatted dates", () => {
    expect(
      screen.getByText(formatDateTime("2023-11-01T12:00:00.000Z"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatDateTime("2023-11-02T14:00:00.000Z"))
    ).toBeInTheDocument();
  });

  it("renders transaction descriptions", () => {
    expect(screen.getByText("Payment for groceries")).toBeInTheDocument();
    expect(screen.getByText("Subscription payment")).toBeInTheDocument();
  });
});
