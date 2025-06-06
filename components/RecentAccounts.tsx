import { Account } from "@/lib/types";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AccountCard from "./AccountCard";
import Header from "./Header";
import { Button } from "./ui/button";

const RecentAccounts = ({ accounts }: { accounts: Account[] }) => {
  const t = useTranslations("dashboard");

  if (!accounts.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <Header title="recentAccounts" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="border rounded-xl shadow-sm bg-white p-4"
          >
            <AccountCard account={acc} />
            <div className="mt-2 flex justify-end">
              <Link href={`/accounts/${acc.id}`}>
                <Button size="sm" variant="outline">
                  {t("viewAccount")}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAccounts;
