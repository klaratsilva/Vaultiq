export const supportedLocales = ["en", "fr" ] as const;
export type Locale = (typeof supportedLocales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};