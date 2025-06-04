import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getSubjectColor as getTypeColor } from "../utils";
import Link from "next/link";
import Image from "next/image";
import { Account } from "@/utils/types";

interface AccountsListProps {
  accounts: Account[];
}

const AccountsList = ({ accounts }: AccountsListProps) => {
  console.log(accounts);
  return (
    <article className={cn("companion-list", "classNames")}>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="w-1/2">Accounts</TableHead>
            <TableHead className="">Currency</TableHead>
            <TableHead className="text-right">Type</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts?.map(({ id, balance, name, type, ownerName, currency }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/accounts/${id}`}>
                  <div className="p-2 flex items-center gap-3">
                    <div
                      className="size-[64px] flex items-center justify-center rounded-4xl max-md:hidden p-2"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      <h1 className="text-4xl text-white">
                        {ownerName.slice(0, 1)}
                      </h1>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-xl">{name}</p>
                      <p className="text-lg">{ownerName}</p>
                    </div>
                  </div>
                </Link>
              </TableCell>{" "}
              <TableCell>
                <div className="bg-main-1 text-white rounded-4xl text-sm px-4 py-2 capitalize w-fit max-md:hidden">
                  {currency}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full justify-end">
                  <p className="text-lg">
                    <span className=""> {type}</span>
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full justify-end">
                  <p className="text-lg">
                    <span className=""> {balance}</span>
                  </p>
                  <Image
                    src="/icons/clock.svg"
                    alt="minutes"
                    width={14}
                    height={14}
                    className="md:hidden"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default AccountsList;
