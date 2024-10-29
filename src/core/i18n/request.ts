import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../../../public/locales/${locale || defaultLocale}.json`)).default,
    defaultLocale,
    locales: ['en', 'ru'],
    timeZone: 'UTC'
  };
});