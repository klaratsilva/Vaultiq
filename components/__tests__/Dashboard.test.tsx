import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

// Mocks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("../DashboardSummaryCard", () => ({ title, value }: any) => (
  <div>
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
));

jest.mock("../RecentAccounts", () => ({ accounts }: any) => (
  <div>RecentAccounts: {accounts.length}</div>
));

jest.mock("../TransactionTable", () => ({ limit }: any) => (
  <div>TransactionsTable Limit: {limit}</div>
));

describe("Dashboard", () => {
  const mockAccounts = [
    {
      id: "1",
      name: "Checking",
      balance: "1000.50",
      currency: "USD",
      type: "personal",
      ownerName: "Alice",
      ownerId: "1",
      ownerEmail: "alice@example.com",
      createdAt: "2023-01-01",
    },
    {
      id: "2",
      name: "Savings",
      balance: "2000.75",
      currency: "USD",
      type: "business",
      ownerName: "Bob",
      ownerId: "2",
      ownerEmail: "bob@example.com",
      createdAt: "2023-02-01",
    },
    {
      id: "3",
      name: "Travel",
      balance: "300.25",
      currency: "USD",
      type: "personal",
      ownerName: "Charlie",
      ownerId: "3",
      ownerEmail: "charlie@example.com",
      createdAt: "2023-03-01",
    },
  ];

  beforeEach(() => {
    jest.mocked(useSelector).mockImplementation((fn) =>
      fn({
        accounts: {
          accounts: mockAccounts,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders total balance, account count and user count", () => {
    render(<Dashboard userCount={42} />);

    expect(screen.getByText("totalBalance")).toBeInTheDocument();
    expect(screen.getByText("$3301.50")).toBeInTheDocument();

    expect(screen.getByText("totalAccounts")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("totalUsers")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders RecentAccounts and TransactionTable", () => {
    render(<Dashboard userCount={10} />);

    expect(screen.getByText(/RecentAccounts/)).toHaveTextContent("3"); // number of accounts passed
    expect(screen.getByText(/TransactionsTable Limit: 3/)).toBeInTheDocument();
    expect(screen.getByText("recentTransactions")).toBeInTheDocument();
  });
});
