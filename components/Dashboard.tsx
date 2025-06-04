"use client";

import { accountTypeColorsHex } from "@/lib";
import { Account, Transaction } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import AccountCard from "./AccountCard";
import TransactionsTable from "./TransactionTable";
import { Button } from "./ui/button";

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  userCount: number;
}

const Dashboard = ({ accounts, transactions, userCount }: DashboardProps) => {
  const t = useTranslations("dashboard");

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
        <div
          className="card p-4 rounded-lg shadow-md text-white"
          style={{ backgroundColor: accountTypeColorsHex.personal }}
        >
          <h3 className="text-lg font-semibold mb-2">{t("totalBalance")}</h3>
          <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
        </div>

        <div
          className="card p-4 rounded-lg shadow-md text-white"
          style={{ backgroundColor: accountTypeColorsHex.business }}
        >
          <h3 className="text-lg font-semibold mb-2">{t("totalAccounts")}</h3>
          <p className="text-3xl font-bold">{accounts.length}</p>
        </div>

        <div
          className="card p-4 rounded-lg shadow-md text-white"
          style={{ backgroundColor: accountTypeColorsHex.admin }}
        >
          <h3 className="text-lg font-semibold mb-2">{t("totalUsers")}</h3>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{t("recentAccounts")}</h2>
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
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("recentTransactions")}
        </h2>
        <TransactionsTable
          transactions={recentTransactions}
          accountsMap={accountsMap}
        />
      </div>
    </section>
  );
};

export default Dashboard;
