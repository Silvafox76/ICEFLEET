
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await prisma.maintenanceRecord.findMany({
      orderBy: [
        { scheduledDate: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            licensePlate: true
          }
        },
        trailer: {
          select: {
            type: true,
            serialNumber: true
          }
        }
      }
    });

    return NextResponse.json(records || []);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const record = await prisma.maintenanceRecord.create({
      data: {
        type: body.type,
        description: body.description,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        completedDate: body.completedDate ? new Date(body.completedDate) : null,
        odometer: body.odometer ? parseInt(body.odometer) : null,
        cost: body.cost ? parseFloat(body.cost) : null,
        vehicleId: body.vehicleId || null,
        trailerId: body.trailerId || null,
        serviceProvider: body.serviceProvider || null,
        workOrderNumber: body.workOrderNumber || null,
        notes: body.notes || null,
        cloudStoragePath: body.cloudStoragePath || null,
      }
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance record' },
      { status: 500 }
    );
  }
}
