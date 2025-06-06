import { act, render, screen, waitFor } from "@testing-library/react";
import TransactionsTable from "../TransactionTable";
import { Transaction, Account } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer, {
  setTransactions,
  setSearchTerm,
} from "@/store/transactionsSlice";
import accountsReducer, { setAccounts } from "@/store/accountsSlice";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("TransactionsTable with Redux", () => {
  const mockAccounts: Record<string, Account> = {
    "acc-1": {
      id: "acc-1",
      name: "Main Account",
      ownerName: "Alice",
      type: "personal",
      currency: "USD",
      ownerId: "owner-1",
      ownerEmail: "alice@example.com",
      balance: "300.00",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    "acc-2": {
      id: "acc-2",
      name: "Savings",
      ownerName: "Bob",
      type: "business",
      currency: "EUR",
      ownerId: "owner-2",
      ownerEmail: "bob@example.com",
      balance: "500.00",
      createdAt: "2025-01-02T00:00:00.000Z",
    },
  };

  const mockTransactions: Transaction[] = [
    {
      id: "tx-1",
      fromAccountId: "acc-1",
      toAccountId: "acc-2",
      amount: 100,
      currency: "USD",
      targetCurrency: "USD",
      clientConvertedAmount: 100,
      status: "pending",
      createdAt: "2023-11-01T12:00:00.000Z",
      description: "Payment for groceries",
    },
    {
      id: "tx-2",
      fromAccountId: "unknown-id",
      toAccountId: "acc-1",
      amount: 200,
      currency: "EUR",
      targetCurrency: "USD",
      clientConvertedAmount: 200,
      status: "active",
      createdAt: "2023-11-02T14:00:00.000Z",
      description: "Subscription payment",
    },
  ];

  function renderWithRedux(preloadedState: {
    accounts: ReturnType<typeof accountsReducer>;
    transactions: ReturnType<typeof transactionsReducer>;
  }) {
    const store = configureStore({
      reducer: {
        accounts: accountsReducer,
        transactions: transactionsReducer,
      },
      preloadedState,
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <TransactionsTable />
        </Provider>
      ),
    };
  }

  it("renders table headers correctly", () => {
    const initialState = {
      accounts: {
        accounts: [],
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
      transactions: {
        transactions: [],
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    renderWithRedux(initialState);

    expect(screen.getByText("fromAccountHeader")).toBeInTheDocument();
    expect(screen.getByText("toAccountHeader")).toBeInTheDocument();
    expect(screen.getByText("amountHeader")).toBeInTheDocument();
    expect(screen.getByText("statusHeader")).toBeInTheDocument();
    expect(screen.getByText("dateHeader")).toBeInTheDocument();
    expect(screen.getByText("descriptionHeader")).toBeInTheDocument();
  });

  it("renders all transactions and shows 'deletedAccount' for unknown account IDs", () => {
    const initialState = {
      accounts: {
        accounts: Object.values(mockAccounts),
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
      transactions: {
        transactions: mockTransactions,
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    renderWithRedux(initialState);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(1 + mockTransactions.length);

    const matches = screen.getAllByText("Main Account");
    expect(matches.length).toBeGreaterThan(0);
    expect(screen.getByText("Savings")).toBeInTheDocument();
    expect(screen.getByText("100 USD")).toBeInTheDocument();

    expect(screen.getAllByText("accountDeleted").length).toBeGreaterThan(0);

    expect(screen.getAllByText("active").length).toBeGreaterThan(0);

    expect(
      screen.getByText(formatDateTime("2023-11-01T12:00:00.000Z"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatDateTime("2023-11-02T14:00:00.000Z"))
    ).toBeInTheDocument();

    expect(screen.getByText("Payment for groceries")).toBeInTheDocument();
    expect(screen.getByText("Subscription payment")).toBeInTheDocument();
  });

  it("filters transactions by searchTerm from Redux", async () => {
    const initialState = {
      accounts: {
        accounts: Object.values(mockAccounts),
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
      transactions: {
        transactions: mockTransactions,
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    const { store } = renderWithRedux(initialState);

    expect(screen.getByText("Payment for groceries")).toBeInTheDocument();
    expect(screen.getByText("Subscription payment")).toBeInTheDocument();

    await act(async () => {
      store.dispatch(setSearchTerm("groceries"));
    });

    await waitFor(() =>
      expect(screen.queryByText("Subscription payment")).not.toBeInTheDocument()
    );
  });
});
