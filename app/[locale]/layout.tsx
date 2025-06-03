// app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

// Import your messages here (paths relative to this file)
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import Navbar from "@/components/NavBar";
import Image from "next/image";

import MobileNavbar from "../../components/MobileNavbar";

// Map locales to messages
const messagesMap = { en, fr };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = messagesMap[locale];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <main className="relative flex h-screen w-full">
        <Navbar />
        <div className="flex size-full flex-col">
          <div className="flex h-16 items-center justify-between p-5 shadow-creditCard sm:p-8 md:hidden">
            <Image src="/icons/logo.png" alt="logo" width={30} height={30} />
            <div>
              <MobileNavbar />
            </div>
          </div>
          {children}
        </div>
      </main>
    </NextIntlClientProvider>
  );
}
