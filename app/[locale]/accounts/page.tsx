import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountsList from "@/components/AccountsList";
import { getAllAccounts } from "@/lib/api";

const Accounts = async () => {
  const accounts = await getAllAccounts();

  return (
    <section className="no-scrollbar flex flex-col gap-6  p-8 md:max-h-screen xl:py-12">
      <h1 className="text-3xl text-bold">List of Accounts</h1>
      <Link className="cursor-pointer" href="/accounts/new">
        <Button className="btn-primary bg-main-1">Add New Account</Button>
      </Link>

      <AccountsList accounts={accounts} />
    </section>
  );
};

export default Accounts;
