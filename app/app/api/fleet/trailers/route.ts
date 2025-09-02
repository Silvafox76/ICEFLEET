
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const trailers = await prisma.trailer.findMany({
      orderBy: [
        { status: 'asc' },
        { type: 'asc' },
        { serialNumber: 'asc' }
      ],
      include: {
        _count: {
          select: {
            assignments: {
              where: {
                status: {
                  in: ['SCHEDULED', 'IN_PROGRESS']
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(trailers || []);
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trailers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const trailer = await prisma.trailer.create({
      data: {
        serialNumber: body.serialNumber,
        type: body.type,
        requiredTowingCapacity: parseInt(body.requiredTowingCapacity),
        requiredHitchClass: body.requiredHitchClass,
        hasBrakes: body.hasBrakes === true,
        licensePlate: body.licensePlate || null,
        province: body.province,
      }
    });

    return NextResponse.json(trailer);
  } catch (error) {
    console.error('Error creating trailer:', error);
    return NextResponse.json(
      { error: 'Failed to create trailer' },
      { status: 500 }
    );
  }
}
