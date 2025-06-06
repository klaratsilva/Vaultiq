import AccountsList from "@/components/AccountsList";
import Header from "@/components/Header";
import { getAllAccounts } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts • My Bank Manager",
  description: "View all of your bank accounts and their balances.",
  openGraph: {
    title: "Accounts • My Bank Manager",
    description: "Overview of all your accounts and balances.",
  },
};

const Accounts = async () => {
  const accounts = await getAllAccounts();

  return (
    <section className="no-scrollbar flex flex-col gap-6 p-8 md:max-h-screen xl:py-12">
      <Header
        title={"accounts"}
        btn={{ href: "/accounts/new", btnTitle: "newAccount" }}
      />
      <AccountsList accounts={accounts} />
    </section>
  );
};

export default Accounts;
