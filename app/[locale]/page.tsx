import Dashboard from "@/components/Dashboard";
import { getAllAccounts, getAllTransactions } from "@/lib/api";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("dashboard");
  console.log(t("title"), "title");

  const transactions = await getAllTransactions();
  const accounts = await getAllAccounts();

  return (
    <section className="no-scrollbar flex flex-col gap-6  p-8 md:max-h-screen xl:py-12">
      <h1 className="text-2xl text-gray-700 font-bold">{t("welcome")}</h1>
      <Dashboard
        accounts={accounts}
        transactions={transactions}
        userCount={45}
      />
    </section>
  );
}
