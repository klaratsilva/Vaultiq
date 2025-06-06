import AccountForm from "@/components/AccountForm";
import Header from "@/components/Header";
import React from "react";

const AddNewAccount = () => {
  return (
    <section className="no-scrollbar flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <Header title="addNewAccount" />
      <AccountForm />
    </section>
  );
};

export default AddNewAccount;
