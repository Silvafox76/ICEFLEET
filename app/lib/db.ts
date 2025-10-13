import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Use mock data in development if database is not available
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Skip validation during build time - only validate when app actually runs
const isBuildTime = process.env.SKIP_ENV_VALIDATION === 'true' ||
                    process.env.npm_lifecycle_event === 'build'

// Only validate DATABASE_URL at runtime when actually connecting
if (!isBuildTime && process.env.NODE_ENV === 'production' &&
    (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '')) {
  throw new Error('DATABASE_URL is required in production environment')
}

// Create PrismaClient only if DATABASE_URL exists or we're in development
const shouldCreateClient = isBuildTime || process.env.DATABASE_URL || process.env.NODE_ENV === 'development'

export const prisma = shouldCreateClient
  ? (globalForPrisma.prisma || new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    }))
  : null as any // This will never be used at runtime due to validation above

if (process.env.NODE_ENV !== 'production' && shouldCreateClient) {
  globalForPrisma.prisma = prisma
}

export default prisma