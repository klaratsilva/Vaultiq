import React from "react";
import Link from "next/link";
import { Account, Transaction } from "@/lib/types";
import { Button } from "./ui/button";
import TransactionsTable from "./TransactionTable";
import AccountDetails from "./AccountDetails";
import AccountCard from "./AccountCard";
import { accountTypeColorsHex } from "@/lib";

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  userCount: number;
}

const Dashboard = ({ accounts, transactions, userCount }: DashboardProps) => {
  // Calculate total balance (assumes all balances are in the same currency)

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  const accountsMap = Object.fromEntries(
    accounts.map((acct) => [acct.id, acct])
  );

  // Sort accounts and transactions by most recent (assuming id or createdAt is sortable)
  const recentAccounts = accounts.slice(0, 3);
  const recentTransactions = transactions.slice(0, 3);

  return (
    <section className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className="card p-6 rounded-lg shadow-md text-white"
          style={{ backgroundColor: accountTypeColorsHex.personal }}
        >
          <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
          <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
        </div>

        <div
          className="card p-6 rounded-lg shadow-md text-white"
          style={{ backgroundColor: accountTypeColorsHex.business }}
        >
          <h3 className="text-lg font-semibold mb-2">Total Accounts</h3>
          <p className="text-3xl font-bold">{accounts.length}</p>
        </div>

        <div
          className="card p-6 rounded-lg shadow-md text-white"
          style={{ backgroundColor: accountTypeColorsHex.admin }}
        >
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
      </div>

      {/* Recent Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentAccounts.map((acc) => (
          <div
            key={acc.id}
            className="border rounded-xl shadow-sm bg-white p-4"
          >
            <AccountCard account={acc} />
            <div className="mt-4 flex justify-end">
              <Link href={`/accounts/${acc.id}`}>
                <Button size="sm" variant="outline">
                  View Account
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
        <TransactionsTable
          transactions={transactions}
          accountsMap={accountsMap}
        />
      </div>
    </section>
  );
};

export default Dashboard;
