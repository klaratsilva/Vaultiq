import { render, screen } from "@testing-library/react";
import Navbar from "../NavBar";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useLocale: jest.fn(),
  useTranslations: jest.fn(),
}));

jest.mock("../../constants", () => ({
  sidebarLinks: [
    { labelKey: "dashboard", route: "/", imgURL: "/icons/dashboard.svg" },
    { labelKey: "settings", route: "/settings", imgURL: "/icons/settings.svg" },
  ],
  SidebarItem: {},
}));

jest.mock("../../i18n/locales", () => ({
  supportedLocales: ["en", "fr"],
  localeNames: { en: "English", fr: "Français" },
}));

describe("Navbar", () => {
  beforeEach(() => {
    (useLocale as jest.Mock).mockReturnValue("en");

    (useTranslations as jest.Mock).mockReturnValue((key: string) => {
      const mockTranslations: Record<string, string> = {
        dashboard: "Dashboard",
        settings: "Settings",
      };
      return mockTranslations[key] || key;
    });
  });

  it("renders logo and sidebar links", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByText("VaultIq")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("highlights the active link", () => {
    (usePathname as jest.Mock).mockReturnValue("/en/settings");

    render(<Navbar />);

    const settingsLink = screen.getByText("Settings");
    expect(settingsLink).toHaveClass("text-white");
  });

  it("renders locale switcher", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByLabelText("Switch to English")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to Français")).toBeInTheDocument();
  });
});
