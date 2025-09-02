
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: [
        { status: 'asc' },
        { make: 'asc' },
        { model: 'asc' }
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

    return NextResponse.json(vehicles || []);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const vehicle = await prisma.vehicle.create({
      data: {
        vin: body.vin,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        licensePlate: body.licensePlate,
        towingCapacity: parseInt(body.towingCapacity),
        hitchClass: body.hitchClass,
        fuelType: body.fuelType,
        province: body.province,
        odometer: parseInt(body.odometer) || 0,
      }
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}
