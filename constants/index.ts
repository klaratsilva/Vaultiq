
// sidebarRoutes.ts
export type SidebarItem = {
  imgURL: string;
  /** route without any locale prefix. Example: "/" or "/accounts" */
  route: string;
  /** translation key path, e.g. "sidebar.home" */
  labelKey: string;
};

// We’ll prefix these with the locale when rendering:
export const sidebarLinks: SidebarItem[] = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    labelKey: "home",
  },
  {
    imgURL: "/icons/dollar-circle.svg",
    route: "/accounts",
    labelKey: "accounts",
  },
  {
    imgURL: "/icons/transaction.svg",
    route: "/transactions",
    labelKey: "transactions",
  },
];


