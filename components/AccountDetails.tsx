"use client";

import { Account } from "@/lib/types";
import { useTranslations } from "next-intl";

interface AccountDetailsProps {
  account: Account;
}

const InfoRow = ({
  label,
  value,
  transform,
}: {
  label: string;
  value: string | number;
  transform?: "uppercase" | "capitalize" | "break-all";
}) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-100">{label}</span>
    <span
      className={`text-lg font-medium text-white ${
        transform === "uppercase"
          ? "uppercase"
          : transform === "capitalize"
          ? "capitalize"
          : transform === "break-all"
          ? "break-all"
          : ""
      }`}
    >
      {value}
    </span>
  </div>
);

const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { id, name, balance, currency, type, ownerName, ownerEmail } = account;
  const t = useTranslations("accountDetails");

  return (
    <article className="p-12 rounded-2xl shadow-md border bg-primary border-grey space-y-12">
      <div className="flex items-center gap-6">
        <div className="size-[72px] flex shadow-lg items-center justify-center rounded-4xl bg-white text-primary text-4xl font-bold">
          {ownerName.slice(0, 1)}
        </div>
        <h2 className="text-3xl font-bold text-gray-100">{name}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InfoRow label={t("ownerName")} value={name} />
        <InfoRow label={t("ownerEmail")} value={ownerEmail} />

        <div className="col-span-1 sm:col-span-2">
          <InfoRow label={t("balance")} value={balance} />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <InfoRow
            label={t("currency")}
            value={currency}
            transform="uppercase"
          />
        </div>

        <InfoRow label={t("accountType")} value={type} transform="capitalize" />
        <InfoRow label={t("accountId")} value={id} transform="break-all" />
      </div>
    </article>
  );
};

export default AccountDetails;
