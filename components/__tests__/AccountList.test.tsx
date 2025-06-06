import { act, render, screen, waitFor } from "@testing-library/react";
import AccountsList from "../AccountsList";
import { Account, AccountType, Currency } from "@/lib/types";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer, {
  setAccounts,
  setSearchTerm,
  setCurrentPage,
} from "@/store/accountsSlice";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("AccountsList with Redux", () => {
  const mockAccounts: Account[] = [
    {
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
    {
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
  ];

  function renderWithRedux(preloadedState: {
    accounts: ReturnType<typeof accountsReducer>;
  }) {
    const store = configureStore({
      reducer: {
        accounts: accountsReducer,
      },
      preloadedState,
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <AccountsList />
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
    };

    renderWithRedux(initialState);

    expect(screen.getByText("accounts")).toBeInTheDocument();
    expect(screen.getByText("currency")).toBeInTheDocument();
    expect(screen.getByText("balance")).toBeInTheDocument();
    expect(screen.getByText("date")).toBeInTheDocument();
    expect(screen.getByText("type")).toBeInTheDocument();
  });

  it("renders all accounts correctly", () => {
    const initialState = {
      accounts: {
        accounts: mockAccounts,
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    renderWithRedux(initialState);

    expect(screen.getByText("Main Account")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Savings")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("300.00")).toBeInTheDocument();
    expect(screen.getByText("500.00")).toBeInTheDocument();

    expect(screen.getByText("personal")).toBeInTheDocument();
    expect(screen.getByText("business")).toBeInTheDocument();
  });

  it("filters accounts by searchTerm from Redux", async () => {
    const initialState = {
      accounts: {
        accounts: mockAccounts,
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    const { store } = renderWithRedux(initialState);

    expect(screen.getByText("Main Account")).toBeInTheDocument();
    expect(screen.getByText("Savings")).toBeInTheDocument();

    await act(async () => {
      store.dispatch(setSearchTerm("main"));
    });

    await waitFor(() => {
      expect(screen.getByText("Main Account")).toBeInTheDocument();
      expect(screen.queryByText("Savings")).not.toBeInTheDocument();
    });
  });

  it("shows no accounts found message when no accounts match search", () => {
    const initialState = {
      accounts: {
        accounts: mockAccounts,
        searchTerm: "non-existent",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    renderWithRedux(initialState);

    expect(screen.getByText("noAccountsFound")).toBeInTheDocument();
  });

  it("handles pagination controls", async () => {
    const initialState = {
      accounts: {
        accounts: Array(10)
          .fill(null)
          .map((_, i) => ({
            id: `acc-${i}`,
            name: `Account ${i}`,
            ownerName: `Owner ${i}`,
            type: "personal" as AccountType,
            currency: "USD" as Currency,
            ownerId: `owner-${i}`,
            ownerEmail: `owner${i}@example.com`,
            balance: `${100 + i}`,
            createdAt: "2025-01-01T00:00:00.000Z",
          })),
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    };

    const { store } = renderWithRedux(initialState);

    expect(screen.getByText("Account 0")).toBeInTheDocument();
    expect(screen.queryByText("Account 6")).not.toBeInTheDocument();

    await act(async () => {
      store.dispatch(setCurrentPage(2));
    });

    waitFor(() => {
      expect(screen.getByText("Account 6")).toBeInTheDocument();
      expect(screen.queryByText("Account 0")).not.toBeInTheDocument();
    });
  });
});
