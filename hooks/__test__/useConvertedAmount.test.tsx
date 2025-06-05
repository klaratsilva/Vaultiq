import { renderHook } from "@testing-library/react";
import { useConvertedAmount } from "../useConvertedAmount";
import { convertCurrency } from "../../lib";
import { Account, Currency } from "@/lib/types";

// Mock convertCurrency function
jest.mock("../../lib", () => ({
  convertCurrency: jest.fn(),
}));

describe("useConvertedAmount", () => {
  const accounts: Account[] = [
    {
      id: "0779487f-29c1-49ac-a412-500ef063f1a0",
      name: "Personal Savings",
      type: "personal",
      currency: "EUR" as Currency,
      balance: "4034.26",
      ownerEmail: "sim@gmail.com",
      ownerName: "Simao Silva",
      ownerId: "8676bf3e-4114-4c07-850e-7fa2345f6a07",
    },
    {
      id: "12345678-9abc-def0-1234-56789abcdef0",
      name: "Business Checking",
      type: "business",
      currency: "USD" as Currency,
      balance: "12000.00",
      ownerEmail: "alice@example.com",
      ownerName: "Alice Johnson",
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when currencies are the same", () => {
    const { result } = renderHook(() =>
      useConvertedAmount({
        fromAccountId: "acc1",
        toAccountId: "acc3",
        amount: 100,
        accounts,
      })
    );

    expect(convertCurrency).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it("returns null when amount is zero or less", () => {
    const { result } = renderHook(() =>
      useConvertedAmount({
        fromAccountId: "acc1",
        toAccountId: "acc2",
        amount: 0,
        accounts,
      })
    );

    expect(convertCurrency).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it("returns null when from or to account is not found", () => {
    const { result } = renderHook(() =>
      useConvertedAmount({
        fromAccountId: "unknown",
        toAccountId: "acc2",
        amount: 100,
        accounts,
      })
    );

    expect(convertCurrency).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });
});
