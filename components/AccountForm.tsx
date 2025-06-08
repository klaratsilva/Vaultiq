"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { accountTypes, currencies } from "@/lib/types";
import { accountFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { Button } from "./ui/button";

import { createAccount, updateAccount } from "@/lib/api";
import { addAccount, updateAccountAction } from "@/store/accountsSlice";
import { useAppDispatch } from "@/store/hooks";
import CustomSelect from "./CustomSelect";
import { Input } from "./ui/input";

interface NewAccountFormProps {
  initialData?: Partial<z.infer<typeof accountFormSchema>>;
}

const AccountForm = ({ initialData }: NewAccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

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
    defaultValues: initialData ?? {
      name: "",
      type: accountTypes[0],
      currency: currencies[0],
      ownerEmail: "",
      ownerName: "",
      balance: 0,
    },
  });

  const isEdit = !!initialData?.id;

  async function onSubmit(data: z.infer<typeof accountFormSchema>) {
    setIsLoading(true);

    try {
      if (isEdit && initialData?.id) {
        const updatedAccount = await updateAccount(initialData.id, data);
        dispatch(updateAccountAction(updatedAccount));
      } else {
        const createdAccount = await createAccount(data);
        dispatch(addAccount(createdAccount));
      }

      form.reset();
      router.push("/accounts");
    } catch (error) {
      alert("An unexpected error occurred: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="form-container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomInput
            control={form.control}
            name="name"
            label={t("labels.accountName")}
            placeholder={t("placeholders.accountName")}
          />

          <div className="flex flex-col md:flex-row gap-5 md:gap-10 max-w-full md:max-w-[100%]">
            <div className="flex-1 min-w-0 gap-2">
              <CustomSelect
                control={form.control}
                name="type"
                label={t("labels.accountType")}
                options={accountTypeOptions}
              />
            </div>
            <div className="flex-1 min-w-0">
              <CustomSelect
                control={form.control}
                name="currency"
                label={t("labels.currency")}
                options={currencyOptions}
              />
            </div>
          </div>

          <CustomInput
            control={form.control}
            name="ownerEmail"
            label={t("labels.ownerEmail")}
            placeholder={t("placeholders.ownerEmail")}
          />
          <CustomInput
            control={form.control}
            name="ownerName"
            label={t("labels.ownerName")}
            placeholder={t("placeholders.ownerName")}
          />
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FormLabel>{t("labels.balance")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("placeholders.balance")}
                    className="account-input"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />

          <Button type="submit" className="bg-primary">
            {t("submit")}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AccountForm;
