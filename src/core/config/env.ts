// Type for our environment variables
export interface EnvVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_TONAPI_KEY?: string
  NEXT_PUBLIC_COLLECTION_ADDRESS: string
  NEXT_PUBLIC_BURN_CONTRACT_ADDRESS: string
}

// Export environment variables
export const env: EnvVariables = {
  NODE_ENV: process.env.NODE_ENV as EnvVariables['NODE_ENV'],
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000',
  NEXT_PUBLIC_TONAPI_KEY: process.env.NEXT_PUBLIC_TONAPI_KEY,
  NEXT_PUBLIC_COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_COLLECTION_ADDRESS!,
  NEXT_PUBLIC_BURN_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_BURN_CONTRACT_ADDRESS!,
}

// Validate required environment variables
const requiredEnvs: (keyof EnvVariables)[] = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_COLLECTION_ADDRESS',
  'NEXT_PUBLIC_BURN_CONTRACT_ADDRESS',
]

for (const key of requiredEnvs) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}