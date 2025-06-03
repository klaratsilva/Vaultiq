import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Accounts = () => {
  return (
    <div>
      <h1>Accounts</h1>
      <Link href="/accounts/new">
        <Button className="btn-primary">Add New Account</Button>
      </Link>
    </div>
  );
};

export default Accounts;
