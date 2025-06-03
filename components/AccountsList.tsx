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
      <h2 className="font-bold text-3xl">{"title"}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Accounts</TableHead>
            <TableHead className="text-lg">Currency</TableHead>
            <TableHead className="text-lg text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts?.map(({ id, balance, name, type, ownerName, currency }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/accounts/${id}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      <h1 className="text-4xl text-white">
                        {ownerName.slice(0, 1)}
                      </h1>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-2xl">{name}</p>
                      <p className="text-lg">{ownerName}</p>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div className="subject-badge w-fit max-md:hidden">
                  {currency}
                </div>
                <div
                  className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {/* <Image
                      src={`/icons/${subject}.svg`}
                      alt={subject}
                      width={18}
                      height={18}
                    /> */}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full justify-end">
                  <p className="text-2xl">
                    <span className=""> {type}</span>
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full justify-end">
                  <p className="text-2xl">
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
