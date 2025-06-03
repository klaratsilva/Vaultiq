// i18n/locales.ts
export const supportedLocales = ["en", "fr" ] as const;
export type Locale = (typeof supportedLocales)[number];

// A simple map of “display name” for each locale.
// (You could also put these under “messages” and call t(`languages.${code}`) instead.)
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};