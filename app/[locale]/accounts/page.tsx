import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountsList from "@/components/AccountsList";

const Accounts = async () => {
  const res = await fetch("http://localhost:4000/accounts", {
    cache: "no-store",
  }); // no caching to always fetch fresh
  const accounts = await res.json();

  return (
    <div className="p-7">
      <Link href="/accounts/new">
        <Button className="btn-primary">Add New Account</Button>
      </Link>

      <AccountsList accounts={accounts} />
    </div>
  );
};

export default Accounts;
