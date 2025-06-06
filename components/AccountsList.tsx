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
import { currencyStyles, getTypeColor } from "../lib/utils";
import { Badge } from "./Badge";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";

interface AccountsListProps {
  accounts: Account[];
}

const AccountsList = () => {
  const t = useTranslations("accounts");
  const dispatch = useDispatch();

  const accounts = useSelector((state: RootState) => state.accounts.accounts);
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
              <TableHead className="w-1/2">{t("accounts")}</TableHead>
              <TableHead className="">{t("currency")}</TableHead>
              <TableHead className="text-right">{t("type")}</TableHead>
              <TableHead className="text-right">{t("balance")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map(
                ({ id, balance, name, type, ownerName, currency }) => (
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
                    <TableCell>
                      <div className="rounded-4xl text-sm px-4 py-2 w-fit max-md:hidden">
                        <Badge
                          label={currency}
                          variant={currency}
                          styleMap={currencyStyles}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-full justify-end">
                        <p className="text-md">
                          <span>{type}</span>
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-full justify-end">
                        <p className="text-lg">
                          <span>{balance}</span>
                        </p>
                      </div>
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
