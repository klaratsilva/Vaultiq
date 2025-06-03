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
import { Currency, transactionSchema } from "@/utils";
import { Button } from "./ui/button";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import { type } from "os";
import { Input } from "./ui/input";

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
      console.log(values);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Failed to create transaction: " + JSON.stringify(error));
        return;
      }

      alert("Transaction created!");
      form.reset();
      router.push("/transactions");
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: `${acc.name} - ${acc.currency} - ${acc.ownerName}`,
  }));
  return (
    <section className="p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CustomSelect
            control={form.control}
            name="fromAccountId"
            label="From Account"
            options={accountOptions}
          />
          <CustomSelect
            control={form.control}
            name="toAccountId"
            label="To Account"
            options={accountOptions}
          />

          <FormField
            control={form.control}
            name={"amount"}
            render={({ field }) => (
              <div className="form-item">
                <FormLabel>{"Amount"}</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      id={"amount"}
                      placeholder={"Enter amount"}
                      type="number"
                      className="input-class"
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : String(field.value)
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        // Convert empty string to undefined (to reset) or to number
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
            label="Description"
            placeholder="What's this for?"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default TransactionForm;
