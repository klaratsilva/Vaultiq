import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteAccountButton } from "../DeleteAccountButton";
import * as api from "@/lib/api";
import { removeAccount } from "@/store/accountsSlice";

const mockDispatch = jest.fn();
const mockPush = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("../../lib/api", () => ({
  deleteAccount: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("DeleteAccountButton", () => {
  const id = "acc-123";
  const locale = "en";

  it("renders the delete button", () => {
    render(<DeleteAccountButton id={id} locale={locale} />);
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("asks for confirmation on click", () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    render(<DeleteAccountButton id={id} locale={locale} />);

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(confirmSpy).toHaveBeenCalled();
    expect(api.deleteAccount).not.toHaveBeenCalled();
  });

  it("calls deleteAccount and dispatches on success", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    (api.deleteAccount as jest.Mock).mockResolvedValue(true);

    render(<DeleteAccountButton id={id} locale={locale} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(api.deleteAccount).toHaveBeenCalledWith(id);
      expect(mockDispatch).toHaveBeenCalledWith(removeAccount(id));
      expect(mockPush).toHaveBeenCalledWith(`/${locale}/accounts`);
    });
  });

  it("alerts on failed delete", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    (api.deleteAccount as jest.Mock).mockResolvedValue(false);
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<DeleteAccountButton id={id} locale={locale} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(api.deleteAccount).toHaveBeenCalledWith(id);
      expect(alertSpy).toHaveBeenCalledWith("Failed to delete");
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("alerts on API error", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    (api.deleteAccount as jest.Mock).mockRejectedValue(new Error("API error"));
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<DeleteAccountButton id={id} locale={locale} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Failed to delete");
    });
  });

  it("shows loading text while deleting", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    (api.deleteAccount as jest.Mock).mockImplementation(
      () => new Promise((res) => setTimeout(() => res(true), 100))
    );

    render(<DeleteAccountButton id={id} locale={locale} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/Deleting/i)).toBeInTheDocument();
    });
  });
});
