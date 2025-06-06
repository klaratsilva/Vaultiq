import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import { getAllAccounts } from "@/lib/api";
import { Account } from "@/lib/types";

const NewTransactionPage = async () => {
  return (
    <section className="no-scrollbar flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <Header title={"addNewTransaction"} />
      <TransactionForm />
    </section>
  );
};

export default NewTransactionPage;
