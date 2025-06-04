import TransactionTable from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { getAllAccounts, getAllTransactions } from "@/lib/api";
import { Account } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const Transactions = async ({ params }: { params: { locale: string } }) => {
  const { locale } = await params;
  const transactions = await getAllTransactions();
  const accounts = await getAllAccounts();

  const accountsMap = Object.fromEntries(
    accounts.map((account: Account) => [account.id, account])
  );

  const t = await getTranslations("TransactionsPage");

  if (!transactions || transactions.length === 0) {
    return <div className="p-8">{t("noTransactions")}</div>;
  }

  return (
    <section className="no-scrollbar flex flex-col gap-6  p-8 md:max-h-screen xl:py-12">
      <h1 className="text-3xl text-bold">{t("title")}</h1>
      <Link className="cursor-pointer" href="/transactions/new">
        <Button className="btn-primary bg-main-1">{t("newButton")}</Button>
      </Link>

      <TransactionTable transactions={transactions} accountsMap={accountsMap} />
    </section>
  );
};

export default Transactions;
