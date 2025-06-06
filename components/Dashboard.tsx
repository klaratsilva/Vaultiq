"use client";

import { accountTypeColorsHex } from "@/lib/utils";
import { RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "./DashboardSummaryCard";
import Header from "./Header";
import RecentAccounts from "./RecentAccounts";
import TransactionsTable from "./TransactionTable";

interface DashboardProps {
  userCount: number;
}

const Dashboard = ({ userCount }: DashboardProps) => {
  const t = useTranslations("dashboard");
  const accounts = useSelector((state: RootState) => state.accounts.accounts);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + Number(acc.balance), 0),
    [accounts]
  );

  const recentAccounts = useMemo(() => accounts.slice(0, 3), [accounts]);

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
      <RecentAccounts accounts={recentAccounts} />
      <div>
        <Link href={"/transactions"}>
          <div className="flex flex-col gap-3">
            <Header title="recentTransactions" />
            <TransactionsTable limit={3} />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
