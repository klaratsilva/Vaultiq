import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    locale: string;
    id: string;
  };
}

const AccountDetailPage = async ({ params }: Props) => {
  const { id, locale } = params;

  return (
    <div className="no-scrollbar flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <h1 className="text-3xl text-bold">Account Detail Page</h1>
      <Link href={`/${locale}/accounts/${id}/edit`}>
        <Button>Edit Account</Button>
      </Link>
    </div>
  );
};

export default AccountDetailPage;
