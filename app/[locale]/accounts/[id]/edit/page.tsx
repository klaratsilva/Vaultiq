import NewAccountForm from "../../../../../components/NewAccountForm";
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

  return <NewAccountForm initialData={data} />;
}
