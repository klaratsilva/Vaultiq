import Link from "next/link";
import { cn } from "../lib/utils";

interface LocaleSwitcherProps {
  supportedLocales: readonly string[];
  basePath: string;
  locale: string;
  localeNames: Record<string, string>;
}

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({
  supportedLocales,
  basePath,
  locale,
  localeNames,
}) => {
  return (
    <footer className="flex mb-4 border-t pt-4 items-center justify-center">
      <div className="flex gap-2 justify-end">
        {supportedLocales.map((loc) => (
          <Link
            key={loc}
            href={`/${loc}${basePath}`}
            className={cn(
              "locale-switcher-link",
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
  );
};

export default LocaleSwitcher;
