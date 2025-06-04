import TransactionForm from "@/components/TransactionForm";
import { getAllAccounts } from "@/lib/api";
import { Account } from "@/utils/types";

const NewTransactionPage = async () => {
  const accounts = await getAllAccounts();

  if (accounts.length === 0) {
    return <div>No accounts found. Please add an account to get started.</div>;
  }

  const accountOptions = accounts.map((acc: Account) => ({
    id: acc.id,
    name: acc.name,
    currency: acc.currency,
    ownerName: acc.ownerName,
  }));

  return (
    <section className="no-scrollbar flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <h1 className="text-3xl text-bold">Add a new Account</h1>
      <TransactionForm accounts={accountOptions} />
    </section>
  );
};

export default NewTransactionPage;
