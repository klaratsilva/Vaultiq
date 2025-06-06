import AccountsList from "@/components/AccountsList";
import Header from "@/components/Header";
import { getAllAccounts } from "@/lib/api";

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
