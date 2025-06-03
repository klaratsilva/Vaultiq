// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { SidebarItem, sidebarLinks } from "../constants";
import { supportedLocales, localeNames } from "../i18n/locales";
import { cn } from "@/utils";

function stripLocaleFromPath(path: string) {
  const parts = path.split("/").slice(2);
  return "/" + parts.join("/");
}

export default function Navbar() {
  const t = useTranslations("sidebar");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = stripLocaleFromPath(pathname);
  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between  border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4  xl:p-6 2xl:w-[355px]">
      <nav className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Link href="/" locale={locale} className="mb-8 flex items-center gap-2">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={44}
            height={44}
            className="h-[44px] w-[44px]"
          />
          <h1 className="text-3xl text-[var(--chart-3)] font-bold">VaultIq</h1>
        </Link>

        {sidebarLinks.map((item: SidebarItem) => {
          const isHome = item.route === "/";
          const isActive = isHome
            ? basePath === "/"
            : basePath === item.route || basePath.startsWith(item.route + "/");

          return (
            <Link
              key={item.labelKey}
              href={item.route}
              locale={locale}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2", {
                "bg-[var(--chart-3)] text-white": isActive,
                "text-gray-700 hover:bg-gray-100": !isActive,
              })}
            >
              <div className="relative h-6 w-6">
                <Image
                  src={item.imgURL}
                  alt={item.labelKey}
                  fill
                  className={cn({ "filter brightness-200": isActive })}
                />
              </div>
              <span className={cn({ "text-white": isActive })}>
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>

      <footer className="mt-8 border-t pt-4">
        <div className="flex gap-2  justify-end">
          {supportedLocales.map((loc) => (
            <Link
              key={loc}
              href={`/${loc}${basePath}`}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full text-sm uppercase transition",
                loc === locale
                  ? "bg-[var(--chart-3)] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              )}
              aria-label={`Switch to ${localeNames[loc]}`}
            >
              {loc}
            </Link>
          ))}
        </div>
      </footer>
    </section>
  );
}
