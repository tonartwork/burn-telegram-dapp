// Type for our environment variables
export interface EnvVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_TONAPI_KEY?: string
  NEXT_PUBLIC_COLLECTION_ADDRESS: string
  NEXT_PUBLIC_BURN_CONTRACT_ADDRESS: string
  NEXT_PUBLIC_TONCENTER_MAINNET_KEY: string
}

// Export environment variables
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000',
  NEXT_PUBLIC_TONAPI_KEY: process.env.NEXT_PUBLIC_TONAPI_KEY || '',
  NEXT_PUBLIC_COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_COLLECTION_ADDRESS || '',
  NEXT_PUBLIC_BURN_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_BURN_CONTRACT_ADDRESS || '',
  NEXT_PUBLIC_TONCENTER_MAINNET_KEY: process.env.NEXT_PUBLIC_TONCENTER_MAINNET_KEY || '',
  NEXT_PUBLIC_TONCENTER_TESTNET_KEY: process.env.NEXT_PUBLIC_TONCENTER_TESTNET_KEY || '',
} as const;

// Only validate in development
if (process.env.NODE_ENV === 'development') {
  const requiredEnvs = [
    'NEXT_PUBLIC_COLLECTION_ADDRESS',
    'NEXT_PUBLIC_BURN_CONTRACT_ADDRESS',
    'NEXT_PUBLIC_TONAPI_KEY',
    'NEXT_PUBLIC_TONCENTER_MAINNET_KEY',
    'NEXT_PUBLIC_TONCENTER_TESTNET_KEY',
  ] as const;

  for (const key of requiredEnvs) {
    if (!env[key]) {
      console.warn(`Missing environment variable: ${key}`);
    }
  }
}