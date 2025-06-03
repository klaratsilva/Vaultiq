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
    <div>
      <h1>Account Detail Page</h1>
      <Link href={`/${locale}/accounts/${id}/edit`}>
        <Button>Edit Account</Button>
      </Link>
    </div>
  );
};

export default AccountDetailPage;
