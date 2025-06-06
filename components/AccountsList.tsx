"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Account } from "@/lib/types";
import {
  selectCurrentPage,
  selectPaginatedAccounts,
  selectTotalPages,
  setCurrentPage,
  setSearchTerm,
} from "@/store/accountsSlice";
import { RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { currencyStyles, formatDateTime, getTypeColor } from "../lib/utils";
import { Badge } from "./Badge";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";

interface AccountsListProps {
  accounts: Account[];
}

const AccountsList = () => {
  const t = useTranslations("accounts");
  const dispatch = useDispatch();

  const searchTerm = useSelector(
    (state: RootState) => state.accounts.searchTerm
  );

  const paginatedAccounts = useSelector(selectPaginatedAccounts);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <>
      <article className="rounded-2xl shadow-md border border-grey px-3 pt-3 pb-4 max-lg:w-full bg-white">
        <SearchInput
          placeholder={t("searchAccountPlaceholder")}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("accounts")}</TableHead>
              <TableHead className="px-2 max-md:hidden">
                {t("currency")}
              </TableHead>
              <TableHead className="px-2">{t("balance")}</TableHead>
              <TableHead className="px-2 max-md:hidden">{t("date")}</TableHead>
              <TableHead className="px-2 max-md:hidden">{t("type")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map(
                ({
                  id,
                  balance,
                  name,
                  type,
                  ownerName,
                  currency,
                  createdAt,
                }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <Link href={`/accounts/${id}`}>
                        <div className="p-2 flex items-center gap-3">
                          <div
                            className="size-[44px] flex items-center justify-center rounded-4xl max-md:hidden p-1"
                            style={{ backgroundColor: getTypeColor(type) }}
                          >
                            <h1 className="text-xl text-white">
                              {ownerName.slice(0, 1)}
                            </h1>
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-lg">{name}</p>
                            <p className="text-md">{ownerName}</p>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="min-w-32 pl-2 pr-10 max-md:hidden">
                      <Badge
                        label={currency}
                        variant={currency}
                        styleMap={currencyStyles}
                      />
                    </TableCell>
                    <TableCell className="pl-2 pr-10">
                      <p className="text-lg max-md:text-sm">{balance}</p>
                    </TableCell>
                    <TableCell className="min-w-32 pl-2 pr-10 max-md:hidden">
                      <p className="text-md">{formatDateTime(createdAt)}</p>
                    </TableCell>

                    <TableCell className="min-w-32 pl-2 pr-10 max-md:hidden">
                      <p className="text-md">{type}</p>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  {t("noAccountsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </article>
      {totalPages > 1 && (
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

export default AccountsList;
