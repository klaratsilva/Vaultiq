import { render, screen } from "@testing-library/react";
import AccountDetails from "../AccountDetails";
import { Account } from "@/lib/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
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
  createdAt: "10-30-30",
};

describe("AccountDetails Component", () => {
  it("renders account details correctly", () => {
    render(<AccountDetails account={mockAccount} />);

    expect(screen.getAllByText(/Savings Account/i).length).toBeGreaterThan(0);
    expect(screen.getByText("J")).toBeInTheDocument();

    expect(screen.getByText(/1500.75/i)).toBeInTheDocument();
    expect(screen.getByText(/business/i)).toBeInTheDocument();
    expect(screen.getByText(/usd/i)).toBeInTheDocument();
    expect(screen.getByText(/acc-123456/i)).toBeInTheDocument();
    expect(screen.getByText(/kl@getMaxAge.com/i)).toBeInTheDocument();
  });

  it("renders initial of owner name", () => {
    render(<AccountDetails account={mockAccount} />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
