import AccountForm from "@/components/AccountForm";
import Header from "@/components/Header";
import React from "react";

const AddNewAccount = () => {
  return (
    <section className="page-section">
      <Header title="addNewAccount" />
      <AccountForm />
    </section>
  );
};

export default AddNewAccount;
