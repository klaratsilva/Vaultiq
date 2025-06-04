"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { cn, statusStyles, getTypeColor } from "../utils";

import { Account, Transaction, TransactionStatus } from "@/utils/types";
import { useTranslations } from "next-intl";

const StatusBadge = (status: TransactionStatus) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    statusStyles[status] || statusStyles.default;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
        borderColor,
        chipBackgroundColor
      )}
    >
      <div className={cn("w-3 h-3 rounded-full", backgroundColor)} />
      <span className={textColor}>{status}</span>
    </div>
  );
};

const TransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const t = useTranslations("TransactionList");
  // ① Keep a map of accountId → Account in state
  const [accountsMap, setAccountsMap] = useState<Record<string, Account>>({});

  // ② Fetch all unique account IDs just once
  useEffect(() => {
    async function fetchAccountsOnce() {
      // Collect all unique fromAccountId and toAccountId in this batch of transactions
      const accountIds = Array.from(
        new Set(transactions.flatMap((t) => [t.fromAccountId, t.toAccountId]))
      );

      // Fetch each account’s details in parallel
      const responses = await Promise.all(
        accountIds.map((id) =>
          fetch(`/api/accounts/${id}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch account ${id}`);
            return res.json() as Promise<Account>;
          })
        )
      );

      // Build a map of id → Account
      const map: Record<string, Account> = {};
      responses.forEach((acct) => {
        map[acct.id] = acct;
      });

      setAccountsMap(map);
    }

    fetchAccountsOnce().catch((err) => {
      console.error("Error loading accounts in TransactionsTable:", err);
    });
  }, [transactions]);

  // ③ Helper to render a cell, given an accountId
  const renderAccountCell = (accountId: string) => {
    const account = accountsMap[accountId];
    if (!account) {
      return (
        <span className="italic text-gray-500">{t("loadingAccount")}</span>
      );
    }

    return (
      <div className="p-2 flex items-center gap-3">
        <div
          className="size-[48px] flex items-center justify-center rounded-4xl max-md:hidden p-2"
          style={{ backgroundColor: getTypeColor(account.type) }}
        >
          <h1 className="text-xl text-white">{account.ownerName?.[0]}</h1>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-sm">{account.name}</p>
          <p className="text-xs text-gray-600">{account.ownerName}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-grey px-7 pt-7 pb-10 max-lg:w-full bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-2">{t("fromAccountHeader")}</TableHead>
            <TableHead className="px-2">{t("toAccountHeader")}</TableHead>
            <TableHead className="px-2">{t("amountHeader")}</TableHead>
            <TableHead className="px-2">{t("statusHeader")}</TableHead>
            <TableHead className="px-2">{t("dateHeader")}</TableHead>
            <TableHead className="px-2 max-md:hidden">
              {t("descriptionHeader")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            return (
              <TableRow key={t.id}>
                <TableCell>{renderAccountCell(t.fromAccountId)}</TableCell>
                <TableCell>{renderAccountCell(t.toAccountId)}</TableCell>

                <TableCell className={`pl-2 pr-10 text-lg font-semibold`}>
                  {t.amount}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                  {StatusBadge(t.status)}
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10">
                  {t.createdAt}
                </TableCell>
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  {t.description}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
