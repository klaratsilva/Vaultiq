import AccountForm from "../../../../../components/AccountForm";
import { accountFormSchema } from "@/utils";
import { z } from "zod";

interface Props {
  params: { id: string; locale: string };
}

export default async function EditAccountPage({ params }: Props) {
  const { locale, id } = params;

  const apiUrl = `${process.env.API_URL}/accounts/${id}`;

  const res = await fetch(apiUrl);

  if (!res.ok) throw new Error("Failed to fetch account");

  const data = await res.json();
  console.log(data, "data");

  return (
    <section className="flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <h1 className="text-2xl text-bold">Edit your account: {id}</h1>
      <AccountForm initialData={data} />
    </section>
  );
}
