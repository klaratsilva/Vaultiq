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
import { useState } from "react";
import { Currency, formatAccountOptions, transactionSchema } from "@/lib";
import { Button } from "./ui/button";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import { type } from "os";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";
import { createTransaction } from "@/lib/api";

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

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    setIsLoading(true);

    try {
      await createTransaction(values);
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
          <CustomInput
            control={form.control}
            name="description"
            label={t("labels.description")}
            placeholder={t("placeholders.description")}
          />
          <Button className="bg-main-1" type="submit" disabled={isLoading}>
            {isLoading ? t("buttons.processing") : t("buttons.submit")}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default TransactionForm;
