import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import { getAllAccounts, getAllTransactions, getAllUsers } from "@/lib/api";

export default async function HomePage() {
  const [transactions, accounts, users] = await Promise.all([
    getAllTransactions(),
    getAllAccounts(),
    getAllUsers(),
  ]);
  return (
    <section className="no-scrollbar flex flex-col gap-6  p-8 md:max-h-screen xl:py-12">
      <Header title={"welcome"} />
      <Dashboard
        accounts={accounts}
        transactions={transactions}
        userCount={users.length}
      />
    </section>
  );
}
