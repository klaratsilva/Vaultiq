import { Account } from "@/lib/types";
import { getTypeColor } from "../lib";
import { cn } from "../lib"; // If you're using a utility like `clsx` or `classnames`

interface AccountCardProps {
  account: Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  const { name, ownerName, balance, currency, type } = account;

  return (
    <div className="bg-white p-2 flex gap-4 items-center">
      <div
        className="size-12 flex items-center justify-center rounded-full text-white font-semibold text-lg"
        style={{ backgroundColor: getTypeColor(type) }}
      >
        {ownerName.slice(0, 1)}
      </div>
      <div className="flex flex-col">
        <p className="text-base font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{ownerName}</p>
        <p className="text-sm mt-1">
          Balance:{" "}
          <span className="font-medium">
            {currency} {Number(balance).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AccountCard;
