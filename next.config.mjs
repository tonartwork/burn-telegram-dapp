import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin("./src/core/i18n/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'sense.mypinata.cloud', 'tonapi.io', 'cache.tonapi.io'],
  },
};

export default withNextIntl(nextConfig);
