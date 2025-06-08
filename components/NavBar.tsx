"use client";

import { cn, sidebarLinks } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, supportedLocales } from "../i18n/locales";
import { SidebarItem } from "../lib/utils";
import LocaleSwitcher from "./LocaleSwitcher";

function stripLocaleFromPath(path: string) {
  const parts = path.split("/").slice(2);
  return "/" + parts.join("/");
}

export default function Navbar() {
  const t = useTranslations("sidebar");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = stripLocaleFromPath(pathname);

  function isLinkActive(basePath: string, route: string) {
    if (route === "/") {
      return basePath === "/";
    }
    return basePath === route || basePath.startsWith(route + "/");
  }
  return (
    <section className="navbar">
      <nav className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Link href="/" locale={locale} className="mb-8 flex items-center gap-2">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={44}
            height={44}
            className="h-[44px] w-[44px] opacity-60"
          />
          <h1 className="navbar-logo-text">VaultIq</h1>
        </Link>

        {sidebarLinks.map(({ imgURL, route, labelKey }: SidebarItem) => {
          const active = isLinkActive(basePath, route);

          return (
            <Link
              key={labelKey}
              href={route}
              locale={locale}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2",
                active
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-100"
              )}
            >
              <div className="relative h-6 w-6">
                <Image
                  src={imgURL}
                  alt={labelKey}
                  fill
                  className={cn({ "filter brightness-200": active })}
                />
              </div>
              <span className={cn({ "text-white": active })}>
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>

      <LocaleSwitcher
        supportedLocales={supportedLocales}
        basePath={basePath}
        locale={locale}
        localeNames={localeNames}
      />
    </section>
  );
}
