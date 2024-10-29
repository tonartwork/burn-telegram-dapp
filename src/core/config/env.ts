import { loadEnvConfig } from '@next/env'

// Load environment variables
const { combinedEnv, loadedEnvFiles } = loadEnvConfig(process.cwd())

// Type for our environment variables
export interface EnvVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_TONAPI_KEY?: string
  NEXT_PUBLIC_COLLECTION_ADDRESS: string
}

// Validate and export environment variables
export const env: EnvVariables = {
  NODE_ENV: combinedEnv.NODE_ENV as EnvVariables['NODE_ENV'],
  NEXT_PUBLIC_APP_URL: combinedEnv.NEXT_PUBLIC_APP_URL || 'https://localhost:3000',
  NEXT_PUBLIC_TONAPI_KEY: combinedEnv.NEXT_PUBLIC_TONAPI_KEY,
  NEXT_PUBLIC_COLLECTION_ADDRESS: combinedEnv.NEXT_PUBLIC_COLLECTION_ADDRESS!,
}

// Validate required environment variables
const requiredEnvs: (keyof EnvVariables)[] = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_COLLECTION_ADDRESS',
]

for (const key of requiredEnvs) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}