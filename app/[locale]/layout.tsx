// app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

// Import your messages here (paths relative to this file)
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import Navbar from "@/components/NavBar";

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
      <main className="relative flex h-screen w-full font-inter">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>
      </main>
    </NextIntlClientProvider>
  );
}
