import { NextRequest, NextResponse } from 'next/server';
import { mockVehicles, mockTrailers } from '@/lib/mock-data';
import prisma from '@/lib/db';

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
      // Database not available, use mock data
      console.log('Using mock data - database not available');
      
      if (type === 'trailer') {
        return NextResponse.json({ trailers: mockTrailers });
      } else {
        return NextResponse.json({ vehicles: mockVehicles });
      }
    }
  } catch (error) {
    console.error('Fleet API error:', error);
    // Return mock data as fallback
    return NextResponse.json({ 
      vehicles: mockVehicles,
      trailers: mockTrailers 
    });
  }
}