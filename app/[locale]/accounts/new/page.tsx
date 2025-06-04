import AccountForm from "@/components/AccountForm";
import React from "react";

const AddNewAccount = () => {
  return (
    <section className="no-scrollbar flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <h1 className="text-3xl text-bold">List of Accounts</h1>
      <AccountForm />
    </section>
  );
};

export default AddNewAccount;
