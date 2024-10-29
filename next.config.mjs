import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'sense.mypinata.cloud', 'tonapi.io', 'cache.tonapi.io', 'tonart.work'],
    unoptimized: true,
  },
  output: 'export',
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TONAPI_KEY: process.env.NEXT_PUBLIC_TONAPI_KEY,
    NEXT_PUBLIC_COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_COLLECTION_ADDRESS,
    NEXT_PUBLIC_BURN_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_BURN_CONTRACT_ADDRESS,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  experimental: {
    appDir: true
  },
  trailingSlash: true,
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true
};

const config = withNextIntl(nextConfig);

config.generateStaticParams = async () => {
  return [
    { locale: 'en' },
    { locale: 'ru' }
  ];
};

export default config;