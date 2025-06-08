"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../lib/api";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { removeAccount } from "@/store/accountsSlice";
import { useTranslations } from "next-intl";

export function DeleteAccountButton({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations("accountDetails");

  const handleClick = () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        const success = await deleteAccount(id);
        if (success) {
          dispatch(removeAccount(id));
          router.push(`/${locale}/accounts`);
        } else {
          alert("Failed to delete");
        }
      } catch (err) {
        alert("Failed to delete");
      }
    });
  };

  return (
    <Button className="bg-red-400" onClick={handleClick} disabled={isPending}>
      <span>{isPending ? t("deleting") : t("delete")}</span>
    </Button>
  );
}
