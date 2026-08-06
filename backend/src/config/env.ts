/**
 * env.ts loads environment configuration values.
 */
export const ENVIRONMENT = process.env.NODE_ENV || 'development'
export const PORT = Number(process.env.PORT) || 4000
export const DATABASE_URL = process.env.DATABASE_URL || ''
