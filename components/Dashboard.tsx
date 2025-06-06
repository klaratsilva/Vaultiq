"use client";

import { accountTypeColorsHex } from "@/lib/utils";
import { Account, Transaction } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import AccountCard from "./AccountCard";
import TransactionsTable from "./TransactionTable";
import { Button } from "./ui/button";
import Card from "./DashboardSummaryCard";
import Header from "./Header";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface DashboardProps {
  userCount: number;
}

const Dashboard = ({ userCount }: DashboardProps) => {
  const t = useTranslations("dashboard");
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  const accountsMap = Object.fromEntries(
    accounts.map((acct) => [acct.id, acct])
  );

  const recentAccounts = accounts.slice(0, 3);
  const recentTransactions = transactions.slice(0, 3);

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card
          title={t("totalBalance")}
          value={`$${totalBalance.toFixed(2)}`}
          backgroundColor={accountTypeColorsHex.personal}
        />
        <Card
          title={t("totalAccounts")}
          value={accounts.length}
          backgroundColor={accountTypeColorsHex.business}
          className="max-sm:hidden"
        />
        <Card
          title={t("totalUsers")}
          value={userCount}
          backgroundColor={accountTypeColorsHex.admin}
          className="p-4 max-sm:hidden"
        />
      </div>

      {recentAccounts.length > 0 && (
        <div className="flex flex-col gap-3">
          <Header title="recentAccounts" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAccounts.map((acc) => (
              <div
                key={acc.id}
                className="border rounded-xl shadow-sm bg-white p-4"
              >
                <AccountCard account={acc} />
                <div className="mt-2 flex justify-end">
                  <Link href={`/accounts/${acc.id}`}>
                    <Button size="sm" variant="outline">
                      {t("viewAccount")}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        {recentTransactions.length > 0 && (
          <Link href={"/transactions"}>
            <div className="flex flex-col gap-3">
              <Header title="recentTransactions" />
              <TransactionsTable
                transactions={recentTransactions}
                accountsMap={accountsMap}
              />
            </div>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
