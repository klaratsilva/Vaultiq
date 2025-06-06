import Header from "@/components/Header";
import TransactionTable from "@/components/TransactionTable";
import { getAllAccounts, getAllTransactions } from "@/lib/api";
import { Account } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions • My Bank Manager",
  description: "View and manage all your financial transactions.",
  openGraph: {
    title: "Transactions • My Bank Manager",
    description: "A detailed list of your transactions.",
  },
};

const Transactions = async () => {
  return (
    <section className="no-scrollbar flex flex-col gap-6  p-8 md:max-h-screen xl:py-12">
      <Header
        title={"transactions"}
        btn={{ href: "/transactions/new", btnTitle: "newTransaction" }}
      />

      <TransactionTable />
    </section>
  );
};

export default Transactions;
