import { NextRequest, NextResponse } from 'next/server';
import { mockVehicles, mockTrailers } from '@/lib/mock-data';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Try database first, fall back to mock data
    try {
      if (type === 'trailer') {
        const trailers = await prisma.trailer.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ trailers });
      } else {
        const vehicles = await prisma.vehicle.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ vehicles });
      }
    } catch (dbError) {
      // In non-production environments, fall back to mock data
      if (process.env.NODE_ENV !== 'production') {
        if (type === 'trailer') {
          return NextResponse.json({ trailers: mockTrailers });
        } else {
          return NextResponse.json({ vehicles: mockVehicles });
        }
      }
      console.error('Database error in fleet route:', dbError);
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }
  } catch (error) {
    console.error('Fleet API error:', error);
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ 
        vehicles: mockVehicles,
        trailers: mockTrailers 
      });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}