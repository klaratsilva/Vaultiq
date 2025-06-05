import { render, screen } from "@testing-library/react";
import AccountDetails from "../AccountDetails";
import { Account } from "@/lib/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key, // returns the translation key itself
}));

const mockAccount: Account = {
  id: "acc-123456",
  name: "Savings Account",
  balance: "1500.75",
  currency: "USD",
  type: "business",
  ownerName: "Jane Doe",
  ownerId: "23",
  ownerEmail: "kl@getMaxAge.com",
};

describe("AccountDetails Component", () => {
  it("renders account details correctly", () => {
    render(<AccountDetails account={mockAccount} />);

    expect(screen.getByText(/Savings Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/1500.75/i)).toBeInTheDocument();
    expect(screen.getByText(/business/i)).toBeInTheDocument();
    expect(screen.getByText(/savings/i)).toBeInTheDocument();
    expect(screen.getByText(/usd/i)).toBeInTheDocument();
  });

  it("renders initial of owner name", () => {
    render(<AccountDetails account={mockAccount} />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
