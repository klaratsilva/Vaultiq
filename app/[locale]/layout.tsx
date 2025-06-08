import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import Navbar from "@/components/NavBar";
import Image from "next/image";

import MobileNavbar from "../../components/MobileNavbar";
import { Providers } from "../providers";
import StoreHydrator from "@/components/StoreHydrator";
import { getAllAccounts, getAllTransactions } from "@/lib/api";

export const metadata = {
  title: "My Bank Manager",
  description:
    "Manage your accounts, transactions, and users all in one place.",
  icons: {
    icon: "/icons/logo.png",
    shortcut: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

const messagesMap = { en, fr };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const [accounts, transactions] = await Promise.all([
    getAllAccounts(),
    getAllTransactions(),
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = messagesMap[locale];

  return (
    <Providers>
      <StoreHydrator
        initialAccounts={accounts}
        initialTransactions={transactions}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="relative flex h-screen w-full">
            <Navbar />
            <div className="flex size-full flex-col">
              <div className="flex h-16 p-5 items-center justify-between md:hidden mb-2">
                <div className="flex justify-center items-center">
                  <Image
                    className="mt-2 opacity-60"
                    src="/icons/logo.png"
                    alt="logo"
                    width={44}
                    height={44}
                  />
                  <h1 className="mt-3 text-xl font-bold text-primary">
                    VaultIq
                  </h1>
                </div>
                <div>
                  <MobileNavbar />
                </div>
              </div>
              {children}
            </div>
          </main>
        </NextIntlClientProvider>
      </StoreHydrator>
    </Providers>
  );
}
