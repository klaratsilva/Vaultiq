import { useEffect, useState } from "react";
import { convertCurrency, exchangeRates } from "@/lib/utils";
import { Currency } from "@/lib/types";

interface UseConvertedAmountParams {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  accounts: {
    id: string;
    currency: Currency;
  }[];
}

export function useConvertedAmount({
  fromAccountId,
  toAccountId,
  amount,
  accounts,
}: UseConvertedAmountParams) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    const from = accounts.find((acc) => acc.id === fromAccountId);
    const to = accounts.find((acc) => acc.id === toAccountId);

    if (from && to && from.currency !== to.currency && amount > 0) {
      setConvertedAmount(convertCurrency(amount, from.currency, to.currency, exchangeRates));
    } else {
      setConvertedAmount(null);
    }
  }, [fromAccountId, toAccountId, amount, accounts]);

  return convertedAmount;
}
