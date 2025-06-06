"use client";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { accountFormSchema } from "@/lib/utils";
import { accountTypes, currencies } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { Button } from "./ui/button";

import CustomSelect from "./CustomSelect";
import { Input } from "./ui/input";
import { updateAccount, createAccount } from "@/lib/api";
import { addAccount, updateAccountAction } from "@/store/accountsSlice";
import { useAppDispatch } from "@/store/hooks";

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
    defaultValues: {
      name: "",
      type: accountTypes[0],
      currency: currencies[0],
      ownerEmail: "",
      ownerName: "",
      balance: 0,
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
      if (isEdit && initialData?.id) {
        console.log("updating");
        const updatedAccount = await updateAccount(initialData.id, data);
        console.log("udaped");
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
    <section className="w-full max-w-full md:max-w-[60%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CustomInput
            control={form.control}
            name="name"
            label={t("labels.accountName")}
            placeholder={t("placeholders.accountName")}
          />
          <div className="flex gap-10">
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
                    className="text-sm rounded-lg border border-gray-300 text-gray-500 placeholder:text-gray-500"
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
