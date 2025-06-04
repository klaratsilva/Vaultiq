import { getTypeColor as getTypeColor } from "../lib";
import { Account } from "@/lib/types";

interface AccountDetailsProps {
  account: Account;
}

const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { id, name, balance, currency, type, ownerName } = account;

  return (
    <article
      className={
        "p-12 rounded-2xl shadow-md border border-grey bg-white space-y-12"
      }
    >
      {/* Header Section */}
      <div className="flex items-center gap-6 ">
        <div
          className="size-[72px] flex items-center justify-center rounded-4xl text-white text-4xl font-bold"
          style={{ backgroundColor: getTypeColor(type) }}
        >
          {ownerName.slice(0, 1)}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-lg text-gray-600">{ownerName}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Balance - full width on all screens */}
        <div className="col-span-1 sm:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Balance</span>
            <span className="text-4xl font-medium">{balance}</span>
          </div>
        </div>

        {/* Account ID - full width on all screens */}
        <div className="col-span-1 sm:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Account ID</span>
            <span className="text-lg font-medium break-all">{id}</span>
          </div>
        </div>

        {/* Account Type */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Account Type</span>
          <span className="text-lg font-medium capitalize">{type}</span>
        </div>

        {/* Currency */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Currency</span>
          <span className="text-lg font-medium uppercase">{currency}</span>
        </div>
      </div>
    </article>
  );
};

export default AccountDetails;
