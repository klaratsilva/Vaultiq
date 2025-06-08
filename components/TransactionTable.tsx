"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Account, Transaction } from "@/lib/types";
import { RootState } from "@/store/store";
import {
  selectTransactionCurrentPage,
  selectPaginatedTransactions,
  selectTransactionTotalPages,
  setCurrentPage,
  setSearchTerm,
} from "@/store/transactionsSlice";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime, getTypeColor, statusStyles } from "../lib/utils";
import { Badge } from "./Badge";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";
import { useAppSelector } from "@/store/hooks";
import { selectAccountsMap } from "@/store/accountsSlice";

interface TransactionsTableProps {
  limit?: number;
}

const TransactionsTable = ({ limit }: TransactionsTableProps) => {
  const dispatch = useDispatch();
  const t = useTranslations("TransactionList");

  const accountsMap = useAppSelector(selectAccountsMap);
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const paginatedTransactions = useSelector(selectPaginatedTransactions);
  const currentPage = useSelector(selectTransactionCurrentPage);
  const totalPages = useSelector(selectTransactionTotalPages);
  const searchTerm = useSelector(
    (state: RootState) => state.transactions.searchTerm
  );

  const finalTransactions = limit
    ? transactions.slice(0, limit)
    : paginatedTransactions;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };
  return (
    <>
      <article className="rounded-2xl shadow-md border border-grey px-3 pt-3 pb-4 max-lg:w-full bg-white">
        {!limit && (
          <SearchInput
            placeholder={t("searchTransactiontPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}
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
            {finalTransactions.map(
              ({
                id,
                fromAccountId,
                toAccountId,
                currency,
                amount,
                status,
                createdAt,
                description,
              }: Transaction) => (
                <TableRow key={id}>
                  <TableCell>
                    {renderAccountCell(fromAccountId, accountsMap, t)}
                  </TableCell>
                  <TableCell>
                    {renderAccountCell(toAccountId, accountsMap, t)}
                  </TableCell>

                  <TableCell className="pl-2 pr-10 text-lg font-semibold">
                    {amount} {currency}
                  </TableCell>

                  <TableCell className="max-md:hidden pl-2 pr-10">
                    <Badge
                      label={status}
                      variant={status}
                      styleMap={statusStyles}
                      showDot
                    />
                  </TableCell>

                  <TableCell className="max-md:hidden min-w-32 pl-2 pr-10">
                    {formatDateTime(createdAt)}
                  </TableCell>
                  <TableCell className="max-md:hidden max-w-[250px] pl-2 pr-10">
                    {description}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </article>
      {totalPages > 1 && !limit && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => dispatch(setCurrentPage(currentPage + 1))}
          onPrev={() => dispatch(setCurrentPage(currentPage - 1))}
        />
      )}
    </>
  );
};

export default TransactionsTable;

function renderAccountCell(
  accountId: string,
  accountsMap: Record<string, Account>,
  t: (key: string) => string
) {
  const account = accountsMap[accountId];
  if (!account) {
    return <span className="italic text-gray-500">{t("accountDeleted")}</span>;
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
}
