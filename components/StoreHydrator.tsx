"use client";

import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAccounts } from "@/store/accountsSlice";
import { setTransactions } from "@/store/transactionsSlice";
import { Account, Transaction } from "@/lib/types";

interface Props {
  initialAccounts: Account[];
  initialTransactions: Transaction[];
  children: ReactNode;
}

const StoreHydrator = ({
  initialAccounts,
  initialTransactions,
  children,
}: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sortedAccounts = [...initialAccounts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    console.log(sortedAccounts, "initialAccounts");

    const sortedTransactions = [...initialTransactions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    dispatch(setAccounts(sortedAccounts));
    dispatch(setTransactions(sortedTransactions));
  }, [dispatch, initialAccounts, initialTransactions]);

  return <>{children}</>;
};

export default StoreHydrator;
