import createMiddleware from 'next-intl/middleware';
import i18nConfig from './core/i18n/i18n';

export default createMiddleware(i18nConfig);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
