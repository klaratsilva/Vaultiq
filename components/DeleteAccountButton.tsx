"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../lib/api"; // Import from same file or separate module
import { Button } from "./ui/button";

export function DeleteAccountButton({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteAccount(id);
        router.push(`/${locale}/accounts`);
      } catch (err) {
        alert("Failed to delete");
      }
    });
  };

  return (
    <Button className="bg-red-400" onClick={handleClick} disabled={isPending}>
      <span>{isPending ? "Deleting..." : "Delete"}</span>
    </Button>
  );
}
