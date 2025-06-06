"use client";

import Image from "next/image";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, sidebarLinks } from "../lib/utils";
import { localeNames, supportedLocales } from "@/i18n/locales";

function stripLocaleFromPath(path: string) {
  const parts = path.split("/").slice(2);
  return "/" + parts.join("/");
}

const MobileNavbar = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("sidebar");
  const basePath = stripLocaleFromPath(pathname);

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            alt="menu"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <Link
            href={`/${locale}`}
            className="cursor-pointer flex items-center gap-1 px-8"
          >
            <Image
              src="/icons/logo.png"
              className="opacity-60"
              alt="logo"
              width={64}
              height={64}
            />
            <h1 className="text-4xl font-bold text-primary">VaultIq</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-4 pt-16 text-white items-center">
                {sidebarLinks.map((item) => {
                  const base = item.route === "/" ? "" : item.route;
                  const href = `/${locale}${base}`;
                  const isHome = item.route === "/";
                  const isActive = isHome
                    ? pathname === `/${locale}`
                    : pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <SheetClose key={item.labelKey} asChild>
                      <Link
                        href={href}
                        key={item.labelKey}
                        className={cn(
                          "flex gap-3 items-center p-4 rounded-lg w-full max-w-80",
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.labelKey}
                          width={20}
                          height={20}
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                        />

                        <p
                          className={cn("text-16 font-semibold text-black-2", {
                            "text-white": isActive,
                          })}
                        >
                          {item.labelKey}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>

            <footer className="mb-8 border-t pt-4 px-4">
              <div className="flex gap-2 justify-center">
                {supportedLocales.map((loc) => (
                  <Link
                    key={loc}
                    href={`/${loc}${basePath}`}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full text-sm uppercase transition",
                      loc === locale
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    )}
                    aria-label={`Switch to ${localeNames[loc]}`}
                  >
                    {loc}
                  </Link>
                ))}
              </div>
            </footer>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNavbar;
