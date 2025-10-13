import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Basic health check - just verify the app is running
  // Don't require database for initial health check (allows deployment to succeed)
  const response: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };

  // Try database connection but don't fail if unavailable
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      response.database = 'connected';
    } catch (error) {
      // Database not available, but app is still healthy
      response.database = 'disconnected';
      response.databaseError = error instanceof Error ? error.message : 'Unknown error';
    }
  } else {
    response.database = 'not configured';
  }

  return NextResponse.json(response);
}
