// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Static imports of your locale messages
import en from '../messages/en.json';
import fr from '../messages/fr.json';

// Map of locales to messages
const messagesMap = { en, fr };

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate requested locale against supported locales
  const locale = hasLocale(routing.locales, requestLocale) ? requestLocale : routing.defaultLocale;

  return {
    locale,
    messages: messagesMap[locale],
  };
});