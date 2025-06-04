import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountDetails from "@/components/AccountDetails";
import { getAccountById } from "@/lib/api";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";

interface Props {
  params: {
    locale: string;
    id: string;
  };
}

const AccountDetailPage = async ({ params }: Props) => {
  const { id, locale } = params;

  const account = await getAccountById(id);
  if (!account) {
    return <div>Account not found.</div>;
  }

  return (
    <div className="no-scrollbar flex flex-col lg:flex-row gap-6 overflow-y-scroll p-6 md:max-h-screen xl:py-12">
      <AccountDetails account={account} />
      <div className="w-full lg:w-1/6 flex flex-col gap-4 max-lg:max-w-full max-lg:w-full">
        <Link
          className="cursor-pointer"
          href={`/${locale}/accounts/${id}/edit`}
        >
          <Button className="w-full" variant="outline">
            Edit
          </Button>
        </Link>
        <DeleteAccountButton id={id} locale={locale} />
      </div>
    </div>
  );
};

export default AccountDetailPage;
