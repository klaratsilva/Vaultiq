// __tests__/TransactionForm.redux.spec.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

import TransactionForm from "@/components/TransactionForm";
import accountsReducer, {
  // adjust path if needed
  selectFilteredAccountOptions,
  setAccounts,
} from "@/store/accountsSlice";
import transactionsReducer from "@/store/transactionsSlice";
import { AccountType } from "@/lib/types";

// Mock out modules that TransactionForm consumes:
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key, // simply returns the key
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../lib/api", () => ({
  createTransaction: jest.fn(() =>
    Promise.resolve({
      id: "tx-1",
      fromAccountId: "acc-1",
      toAccountId: "acc-2",
      amount: 100,
      clientConvertedAmount: 100,
      currency: "USD",
      targetCurrency: "USD",
      status: "pending",
      createdAt: new Date().toISOString(),
      description: "Mock Transaction",
    })
  ),
}));

// Sample “accounts” state to preload into the store:
const mockAccounts = [
  {
    id: "acc-1",
    name: "Main Account",
    type: "personal" as AccountType,
    currency: "USD",
    balance: "100.00",
    ownerEmail: "alice@example.com",
    ownerName: "Alice",
    ownerId: "owner-1",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "acc-2",
    name: "Savings Account",
    type: "business" as AccountType,
    currency: "EUR",
    balance: "200.00",
    ownerEmail: "bob@example.com",
    ownerName: "Bob",
    ownerId: "owner-2",
    createdAt: "2025-01-02T00:00:00.000Z",
  },
];

// Helper to render the component with a preloaded Redux store:
function renderWithRedux(
  ui: React.ReactElement,
  {
    preloadedAccounts = mockAccounts,
  }: { preloadedAccounts?: typeof mockAccounts } = {}
) {
  const store = configureStore({
    reducer: {
      accounts: accountsReducer,
      transactions: transactionsReducer,
    },
    preloadedState: {
      accounts: {
        accounts: preloadedAccounts,
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 6,
      },
      transactions: {
        transactions: [],
        searchTerm: "",
        currentPage: 1,
        itemsPerPage: 5,
      },
    },
  });

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

describe("TransactionForm (Redux-connected)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields (From, To, Amount, Description)", () => {
    renderWithRedux(<TransactionForm />);

    // The <CustomSelect /> fields render labels via useTranslations("labels.fromAccount") etc.
    expect(screen.getByLabelText(/labels.fromAccount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/labels.toAccount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/labels.amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/labels.description/i)).toBeInTheDocument();
  });

  // it("opens From Account dropdown and shows account options from Redux", async () => {
  //   renderWithRedux(<TransactionForm />);
  //   // Open the “From Account” select
  //   const fromTrigger = screen.getByRole("combobox", { name: /from account/i });

  //   console.log(fromTrigger, "fromTrigger");
  //   // fireEvent.click(fromTrigger);
  //   const user = userEvent.setup();
  //   await user.click(fromTrigger);

  //   // expect(
  //   //   await screen.findByText(/Main Account.*USD.*Alice/i)
  //   // ).toBeInTheDocument();

  //   const matches = await screen.findAllByText(/Main Account.*USD.*Alice/i);
  //   expect(matches.length).toBeGreaterThan(0);

  //   // Both mockAccounts should appear as option texts (formatAccountOptions prepends “Name – Currency – Owner”)
  //   // expect(
  //   //   await screen.findByText(/Main Account.*USD.*Alice/i)
  //   // ).toBeInTheDocument();
  //   // expect(
  //   //   await screen.findByText(/Savings Account.*EUR.*Bob/i)
  //   // ).toBeInTheDocument();
  // });

  // it("submits a valid transaction and dispatches addTransaction", async () => {
  //   const { store } = renderWithRedux(<TransactionForm />);
  //   // Open and select “From Account” → “Main Account”
  //   fireEvent.click(screen.getByLabelText(/labels.fromAccount/i));
  //   fireEvent.click(screen.getByText(/Main Account.*USD.*Alice/i));

  //   // Open and select “To Account” → “Savings Account”
  //   fireEvent.click(screen.getByLabelText(/labels.toAccount/i));
  //   fireEvent.click(screen.getByText(/Savings Account.*EUR.*Bob/i));

  //   // Fill amount and description
  //   fireEvent.change(screen.getByLabelText(/labels.amount/i), {
  //     target: { value: "100" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/labels.description/i), {
  //     target: { value: "Mock Transaction" },
  //   });

  //   // Click submit
  //   fireEvent.click(screen.getByRole("button", { name: /buttons.submit/i }));

  //   // Wait a tick for the async dispatch
  //   await new Promise((r) => setTimeout(r, 0));

  //   // The transactions slice should now include one new transaction
  //   const state = store.getState().transactions;
  //   expect(state.transactions).toHaveLength(1);
  //   expect(state.transactions[0].fromAccountId).toBe("acc-1");
  //   expect(state.transactions[0].toAccountId).toBe("acc-2");
  //   expect(state.transactions[0].amount).toBe(100);
  //   expect(state.transactions[0].description).toBe("Mock Transaction");
  // });
});
