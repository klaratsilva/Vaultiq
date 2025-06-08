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
    <section className="page-section">
      <Header
        title={"transactions"}
        btn={{ href: "/transactions/new", btnTitle: "newTransaction" }}
      />
      <TransactionTable />
    </section>
  );
};

export default Transactions;
