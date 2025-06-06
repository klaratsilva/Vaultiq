// components/AccountsListWrapper.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAccounts } from "@/store/accountsSlice";
import AccountsList from "./AccountsList";
import { Account } from "@/lib/types";

interface Props {
  initialAccounts: Account[];
}

const AccountsListWrapper = ({ initialAccounts }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAccounts(initialAccounts));
  }, [dispatch, initialAccounts]);

  return <AccountsList />;
};

export default AccountsListWrapper;
