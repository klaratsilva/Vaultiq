import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import { getAllAccounts } from "@/lib/api";
import { Account } from "@/lib/types";

const NewTransactionPage = async () => {
  return (
    <section className="page-section">
      <Header title={"addNewTransaction"} />
      <TransactionForm />
    </section>
  );
};

export default NewTransactionPage;
