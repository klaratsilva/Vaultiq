"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAccounts } from "@/store/accountsSlice";
import { setTransactions } from "@/store/transactionsSlice";
import { Account, Transaction } from "@/lib/types";
import { sortByCreatedAt } from "@/lib/utils";

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

  const sortedAccounts = useMemo(
    () => sortByCreatedAt(initialAccounts),
    [initialAccounts]
  );
  const sortedTransactions = useMemo(
    () => sortByCreatedAt(initialTransactions),
    [initialTransactions]
  );

  useEffect(() => {
    dispatch(setAccounts(sortedAccounts));
    dispatch(setTransactions(sortedTransactions));
  }, [dispatch, initialAccounts, initialTransactions]);

  return <>{children}</>;
};

export default StoreHydrator;
