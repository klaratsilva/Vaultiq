"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Account, Transaction, TransactionStatus } from "@/lib/types";
import { useTranslations } from "next-intl";
import { cn, statusStyles, getTypeColor, formatDateTime } from "../lib/utils";
import { Badge } from "./Badge";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "./Pagination";

interface TransactionsTableProps {
  transactions: Transaction[];
  accountsMap: Record<string, Account>;
}

const TransactionsTable = ({
  transactions,
  accountsMap,
}: TransactionsTableProps) => {
  const t = useTranslations("TransactionList");
  const {
    paginatedData: paginatedTransactions,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePagination(transactions, 7);

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
    <>
      <div className="rounded-2xl shadow-md border border-grey px-3 pt-3 pb-4 max-lg:w-full bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2">{t("fromAccountHeader")}</TableHead>
              <TableHead className="px-2">{t("toAccountHeader")}</TableHead>
              <TableHead className="px-2">{t("amountHeader")}</TableHead>
              <TableHead className="px-2 max-md:hidden">
                {t("statusHeader")}
              </TableHead>
              <TableHead className="px-2 max-md:hidden">
                {t("dateHeader")}
              </TableHead>
              <TableHead className="px-2 max-md:hidden">
                {t("descriptionHeader")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((t: Transaction) => (
              <TableRow key={t.id}>
                <TableCell>{renderAccountCell(t.fromAccountId)}</TableCell>
                <TableCell>{renderAccountCell(t.toAccountId)}</TableCell>

                <TableCell className="pl-2 pr-10 text-lg font-semibold">
                  {t.amount} {t.currency}
                </TableCell>

                <TableCell className="max-md:hidden pl-2 pr-10">
                  <Badge
                    label={t.status}
                    variant={t.status}
                    styleMap={statusStyles}
                    showDot
                  />
                </TableCell>

                <TableCell className="max-md:hidden min-w-32 pl-2 pr-10">
                  {formatDateTime(t.createdAt)}
                </TableCell>
                <TableCell className="max-md:hidden max-w-[250px] pl-2 pr-10">
                  {t.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={goToNextPage}
          onPrev={goToPrevPage}
        />
      )}
    </>
  );
};

export default TransactionsTable;
