"use client";

import { useConvertedAmount } from "@/hooks/useConvertedAmount";
import { createTransaction, getAllAccountsApi } from "@/lib/api";
import { CreateTransactionPayload } from "@/lib/types";
import {
  convertCurrency,
  exchangeRates,
  formatAccountOptions,
  transactionSchema,
} from "@/lib/utils";
import {
  selectFilteredAccountOptions,
  setAccounts,
} from "@/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTransaction } from "@/store/transactionsSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import CustomSelect from "./CustomSelect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const TransactionForm = () => {
  const accounts = useAppSelector(selectFilteredAccountOptions);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations("transactionForm");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
      description: "",
    },
  });

  const accountOptions = useMemo(
    () => formatAccountOptions(accounts),
    [accounts]
  );

  const watchAmount = form.watch("amount");
  const watchFromAccountId = form.watch("fromAccountId");
  const watchToAccountId = form.watch("toAccountId");

  const fromAccount = useMemo(
    () => accounts.find((acc) => acc.id === watchFromAccountId),
    [watchFromAccountId, accounts]
  );
  const toAccount = useMemo(
    () => accounts.find((acc) => acc.id === watchToAccountId),
    [watchToAccountId, accounts]
  );

  const fromAccountOptions = useMemo(() => {
    return accountOptions.filter((option) => option.value !== watchToAccountId);
  }, [accountOptions, watchToAccountId]);

  const toAccountOptions = useMemo(() => {
    return accountOptions.filter(
      (option) => option.value !== watchFromAccountId
    );
  }, [accountOptions, watchFromAccountId]);

  const convertedAmount = useConvertedAmount({
    fromAccountId: watchFromAccountId,
    toAccountId: watchToAccountId,
    amount: watchAmount,
    accounts,
  });

  const insufficientFunds = useMemo(() => {
    if (!fromAccount) return false;
    return watchAmount > Number(fromAccount.balance);
  }, [watchAmount, fromAccount]);

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    setIsLoading(true);
    try {
      const payload: CreateTransactionPayload = {
        ...values,
        clientConvertedAmount: values.amount,
        amount:
          fromAccount &&
          toAccount &&
          fromAccount.currency !== toAccount.currency
            ? convertCurrency(
                values.amount,
                fromAccount.currency,
                toAccount.currency,
                exchangeRates
              )
            : values.amount,
        currency: fromAccount!.currency,
        targetCurrency: toAccount!.currency,
      };
      const createdTransaction = await createTransaction(payload);
      dispatch(addTransaction(createdTransaction));

      const updatedAccounts = await getAllAccountsApi();
      console.log(updatedAccounts, "updatedAccounts");
      dispatch(setAccounts(updatedAccounts));

      form.reset();
      router.push("/transactions");
    } catch (error: any) {
      alert(t("errors.failedToCreate") + ": " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full max-w-full md:max-w-[60%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CustomSelect
            control={form.control}
            name="fromAccountId"
            label={t("labels.fromAccount")}
            options={fromAccountOptions}
          />
          <CustomSelect
            control={form.control}
            name="toAccountId"
            label={t("labels.toAccount")}
            options={toAccountOptions}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FormLabel>{t("labels.amount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("placeholders.amount")}
                    className="text-sm rounded-lg border border-gray-300 text-gray-500 placeholder:text-gray-500"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
                {insufficientFunds && (
                  <p className="text-red-600 text-sm mt-1">
                    {t("errors.insufficientFunds")}
                  </p>
                )}
              </div>
            )}
          />
          {convertedAmount !== null && toAccount && (
            <p className="text-sm text-gray-600">
              {t("labels.convertedAmount")}:{" "}
              <span className="font-semibold">
                {convertedAmount}
                {accounts.find((acc) => acc.id === watchToAccountId)
                  ?.currency ?? ""}
              </span>
            </p>
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FormLabel>{t("labels.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("placeholders.description")}
                  />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          <Button
            className="bg-primary cursor-pointer"
            type="submit"
            disabled={isLoading || insufficientFunds}
          >
            {isLoading ? t("buttons.processing") : t("buttons.submit")}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default TransactionForm;
