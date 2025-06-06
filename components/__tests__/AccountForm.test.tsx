import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountForm from "../AccountForm";
import * as api from "@/lib/api";
import * as redux from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "../../store/store";

// Mock next-intl translations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key.split(".").pop(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock API module
jest.mock("../../lib/api");

// Mock redux hooks
jest.mock("../../store/hooks");

describe("AccountForm", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (redux.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it("renders the form with default values", () => {
    render(<AccountForm />);

    expect(screen.getByLabelText(/accountName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accountType/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ownerEmail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ownerName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/balance/i)).toBeInTheDocument();
  });

  it("renders the form with initial data (edit mode)", () => {
    const initialData = {
      id: "1",
      name: "Test Account",
      type: "personal",
      currency: "USD",
      ownerEmail: "test@example.com",
      ownerName: "John Doe",
      balance: 100,
    };

    render(<AccountForm initialData={initialData} />);

    expect(screen.getByDisplayValue("Test Account")).toBeInTheDocument();
    expect(screen.getByDisplayValue("personal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("USD")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("submits the form to create a new account", async () => {
    (api.createAccount as jest.Mock).mockResolvedValue({
      id: "new-id",
      name: "New Account",
      type: "business",
      currency: "EUR",
      ownerEmail: "new@example.com",
      ownerName: "Jane",
      balance: 500,
    });

    render(<AccountForm />);

    fireEvent.change(screen.getByPlaceholderText(/accountName/i), {
      target: { value: "New Account" },
    });

    fireEvent.change(screen.getByPlaceholderText(/ownerEmail/i), {
      target: { value: "new@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/ownerName/i), {
      target: { value: "Jane" },
    });

    fireEvent.change(screen.getByPlaceholderText(/balance/i), {
      target: { value: 500 },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(api.createAccount).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled(); // addAccount dispatch
      expect(mockPush).toHaveBeenCalledWith("/accounts");
    });
  });
});
