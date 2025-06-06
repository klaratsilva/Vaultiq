"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

interface HeaderProps {
  title: string;
  btn?: {
    href: string;
    btnTitle: string;
  };
}

const Header = ({ title, btn }: HeaderProps) => {
  const t = useTranslations("headers");

  return (
    <>
      <h1 className="text-2xl text-gray-700 font-bold">{t(title)}</h1>
      {btn && (
        <Link href={btn.href} passHref>
          <Button variant="outline">{t(btn.btnTitle)}</Button>
        </Link>
      )}
    </>
  );
};

export default Header;
