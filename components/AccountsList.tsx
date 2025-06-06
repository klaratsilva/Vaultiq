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
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { cn, getTypeColor } from "../lib/utils";
import { Input } from "./ui/input";

interface AccountsListProps {
  accounts: Account[];
}

const AccountsList = ({ accounts }: AccountsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("accounts");

  const filteredAccounts = accounts.filter(
    ({ name, ownerName, type, balance }) =>
      [name, ownerName, type, balance].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <article
      className={cn(
        "rounded-2xl border border-grey px-7 pt-7 pb-10 max-lg:w-full bg-white"
      )}
    >
      <div className="mb-4">
        <Input
          type="search"
          placeholder={t("searchAccountPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

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
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map(
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
                    <div className="bg-yellow-100 text-yellow-600 rounded-4xl text-sm px-4 py-2 w-fit max-md:hidden">
                      {currency}
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
  );
};

export default AccountsList;
