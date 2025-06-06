import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import { getAllUsers } from "@/lib/api";

export default async function HomePage() {
  const users = await getAllUsers();

  return (
    <section className="no-scrollbar flex flex-col gap-6  p-8 md:max-h-screen xl:py-12">
      <Header title={"welcome"} />
      <Dashboard userCount={users.length} />
    </section>
  );
}
