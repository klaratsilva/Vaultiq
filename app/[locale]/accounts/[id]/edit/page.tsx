import { getAccountById } from "@/lib/api";
import AccountForm from "@/components/AccountForm";

interface Props {
  params: { id: string; locale: string };
}

export default async function EditAccountPage({ params }: Props) {
  const { id } = await params;

  const account = await getAccountById(id);
  if (!account) throw new Error("Account not found");

  return (
    <section className="flex flex-col gap-6 overflow-y-scroll p-8 md:max-h-screen xl:py-12">
      <h1 className="text-2xl text-bold">Edit your account: {id}</h1>
      <AccountForm initialData={account} />
    </section>
  );
}
