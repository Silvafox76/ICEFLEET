
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const documents = await prisma.complianceDocument.findMany({
      orderBy: [
        { expiryDate: 'asc' },
        { type: 'asc' }
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

    return NextResponse.json(documents || []);
  } catch (error) {
    console.error('Error fetching compliance documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const document = await prisma.complianceDocument.create({
      data: {
        type: body.type,
        documentNumber: body.documentNumber,
        issueDate: new Date(body.issueDate),
        expiryDate: new Date(body.expiryDate),
        vehicleId: body.vehicleId || null,
        trailerId: body.trailerId || null,
        notes: body.notes || null,
        cloudStoragePath: body.cloudStoragePath || null,
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating compliance document:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance document' },
      { status: 500 }
    );
  }
}
