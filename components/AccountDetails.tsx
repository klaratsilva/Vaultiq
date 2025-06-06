"use client";

import { Account } from "@/lib/types";
import { useTranslations } from "next-intl";

interface AccountDetailsProps {
  account: Account;
}

const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { id, name, balance, currency, type, ownerName, ownerEmail } = account;
  const t = useTranslations("accountDetails");

  return (
    <article
      className={
        "p-12 rounded-2xl shadow-md border bg-primary border-grey space-y-12"
      }
    >
      <div className="flex items-center gap-6 ">
        <div className="size-[72px] flex shadow-lg items-center justify-center rounded-4xl bg-white text-primary text-4xl font-bold">
          {ownerName.slice(0, 1)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-100">{name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-100"> {t("ownerName")}</span>
          <span className="text-lg font-medium  text-white">{name}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-100">{t("ownerEmail")}</span>
          <span className="text-lg font-medium  text-white">{ownerEmail}</span>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-100 ">{t("balance")}</span>
            <span className="text-6xl  text-white font-medium">{balance}</span>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-100">{t("currency")}</span>
            <span className="text-lg font-medium  text-white  uppercase">
              {currency}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-100"> {t("accountType")}</span>
          <span className="text-lg font-medium  text-white  capitalize">
            {type}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm  text-gray-100"> {t("accountId")}</span>
          <span className="text-lg font-medium  text-white break-all">
            {id}
          </span>
        </div>
      </div>
    </article>
  );
};

export default AccountDetails;
