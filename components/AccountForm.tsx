"use client";

import { Form } from "@/components/ui/form";
import { accountFormSchema, accountTypes, currencies } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { Button } from "./ui/button";

import CustomSelect from "./CustomSelect";

interface NewAccountFormProps {
  initialData?: Partial<z.infer<typeof accountFormSchema>>;
}

const AccountForm = ({ initialData }: NewAccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("accountForm");

  const accountTypeOptions = accountTypes.map((type) => ({
    value: type,
    label: t(`accountTypes.${type}`),
  }));

  const currencyOptions = currencies.map((code) => ({
    value: code,
    label: t(`currencies.${code}`),
  }));

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      type: accountTypes[0],
      currency: currencies[0],
      ownerEmail: "",
      ownerName: "",
      balance: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const isEdit = !!initialData?.id;

  async function onSubmit(data: z.infer<typeof accountFormSchema>) {
    setIsLoading(true);

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/accounts/${initialData?.id}` : "/api/accounts";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsLoading(false);
        return;
      }

      form.reset();
      router.push("/accounts");
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CustomInput
            control={form.control}
            name="name"
            label="Account Name"
            placeholder="..add the name of the account"
          />
          <CustomSelect
            control={form.control}
            name="type"
            label={t("labels.accountType")}
            options={accountTypeOptions}
          />
          <CustomSelect
            control={form.control}
            name="currency"
            label={t("labels.currency")}
            options={currencyOptions}
          />

          <CustomInput
            control={form.control}
            name="ownerEmail"
            label="Owner Email"
            placeholder="email"
          />
          <CustomInput
            control={form.control}
            name="ownerName"
            label="Owner Name"
            placeholder="Enter the owner name"
          />
          <CustomInput
            control={form.control}
            name="balance"
            label="balance"
            placeholder="balance"
          />
          <Button type="submit" className="bg-main-1">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AccountForm;
