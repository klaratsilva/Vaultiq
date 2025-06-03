import TransactionForm from "@/components/TransactionForm";
import { Account } from "@/utils/types";
import { Currency } from "lucide-react";

const NewTransactionPage = async () => {
  const res = await fetch("http://localhost:3000/api/accounts");
  const accounts = await res.json();

  const accountOptions = accounts.map((acc: Account) => ({
    id: acc.id,
    name: acc.name,
    currency: acc.currency,
    ownerName: acc.ownerName,
  }));

  return <TransactionForm accounts={accountOptions} />;
};

export default NewTransactionPage;
