"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Currency,
  formatAccountOptions,
  transactionSchema,
  convertCurrency,
} from "@/lib";
import { Button } from "./ui/button";
import CustomSelect from "./CustomSelect";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";
import { createTransaction } from "@/lib/api";
import { Textarea } from "./ui/textarea";
import { CreateTransactionPayload, Transaction } from "@/lib/types";

interface TransactionFormProps {
  accounts: {
    id: string;
    name: string;
    currency: Currency;
    ownerName: string;
  }[];
}

const TransactionForm = ({ accounts }: TransactionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("transactionForm");

  const accountOptions = formatAccountOptions(accounts);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
      description: "",
    },
  });

  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const watchAmount = form.watch("amount");
  const watchFromAccountId = form.watch("fromAccountId");
  const watchToAccountId = form.watch("toAccountId");

  useEffect(() => {
    const from = accounts.find((acc) => acc.id === watchFromAccountId);
    const to = accounts.find((acc) => acc.id === watchToAccountId);

    if (from && to && from.currency !== to.currency && watchAmount > 0) {
      const result = convertCurrency(watchAmount, from.currency, to.currency);
      setConvertedAmount(result);
    } else {
      setConvertedAmount(null);
    }
  }, [watchAmount, watchFromAccountId, watchToAccountId, accounts]);

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    setIsLoading(true);

    const from = accounts.find((acc) => acc.id === values.fromAccountId);
    const to = accounts.find((acc) => acc.id === values.toAccountId);

    try {
      let finalPayload: CreateTransactionPayload;

      if (from && to && from.currency !== to.currency) {
        const converted = convertCurrency(
          values.amount,
          from.currency,
          to.currency
        );

        finalPayload = {
          ...values,
          amount: converted, // Store the converted value
          clientConvertedAmount: values.amount, // Store the original input
          currency: from.currency,
          targetCurrency: to.currency,
        };
      } else {
        finalPayload = {
          ...values,
          amount: values.amount, // Same currency: no conversion
          clientConvertedAmount: values.amount,
          currency: from!.currency,
          targetCurrency: to!.currency,
        };
      }

      await createTransaction(finalPayload);
      form.reset();
      router.push("/transactions");
    } catch (error: any) {
      alert("Failed to create transaction: " + error.message);
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
            options={accountOptions}
          />
          <CustomSelect
            control={form.control}
            name="toAccountId"
            label={t("labels.toAccount")}
            options={accountOptions}
          />

          <FormField
            control={form.control}
            name={"amount"}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FormLabel>{t("labels.amount")}</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      id={"amount"}
                      placeholder={t("placeholders.amount")}
                      type="number"
                      className="text-sm placeholder:text-16 rounded-lg border border-gray-300 text-gray-500 placeholder:text-gray-500"
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : String(field.value)
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : Number(val));
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage className="form-message mt-2" />
                </div>
              </div>
            )}
          />

          {convertedAmount !== null && (
            <div className="text-sm text-gray-600">
              {t("labels.convertedAmount")}:{" "}
              <span className="font-semibold">
                {convertedAmount}{" "}
                {accounts.find((acc) => acc.id === watchToAccountId)
                  ?.currency ?? ""}
              </span>
            </div>
          )}

          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FormLabel>{t("labels.description")}</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("placeholders.description")}
                    />
                  </FormControl>
                  <FormMessage className="form-message mt-2" />
                </div>
              </div>
            )}
          />

          <Button className="bg-primary" type="submit" disabled={isLoading}>
            {isLoading ? t("buttons.processing") : t("buttons.submit")}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default TransactionForm;
