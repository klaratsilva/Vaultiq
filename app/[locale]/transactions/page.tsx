import TransactionList from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { getAllTransactions } from "@/lib/api";
import Link from "next/link";
import React from "react";
import { getTranslations } from "next-intl/server";

const Transactions = async ({ params }: { params: { locale: string } }) => {
  const { locale } = await params;
  const transactions = await getAllTransactions();

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

      <TransactionList transactions={transactions} />
    </section>
  );
};

export default Transactions;
