// components/AccountsListWrapper.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAccounts } from "@/store/accountsSlice";
import AccountsList from "./AccountsList";
import { Account, Transaction } from "@/lib/types";
import { setTransactions } from "@/store/transactionsSlice";
import Dashboard from "./Dashboard";

interface Props {
  initialAccounts: Account[];
  initialTransactions: Transaction[];
  userCount: number;
}

const DashboardWrapper = ({
  initialAccounts,
  initialTransactions,
  userCount,
}: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAccounts(initialAccounts));
    dispatch(setTransactions(initialTransactions));
  }, [dispatch, initialAccounts]);

  return <Dashboard userCount={userCount} />;
};

export default DashboardWrapper;
