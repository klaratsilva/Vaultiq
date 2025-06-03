import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("dashboard");

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p>{t("welcome")}</p>
      <p>Hello</p>
    </section>
  );
}
