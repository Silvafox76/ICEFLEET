
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: [
        { startDate: 'asc' },
        { priority: 'desc' }
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
        },
        leadDriver: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        crewMembers: {
          include: {
            driver: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(assignments || []);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const assignment = await prisma.assignment.create({
      data: {
        jobNumber: body.jobNumber,
        description: body.description,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        leadDriverId: body.leadDriverId,
        vehicleId: body.vehicleId || null,
        trailerId: body.trailerId || null,
        priority: body.priority || 'MEDIUM',
        estimatedHours: body.estimatedHours ? parseInt(body.estimatedHours) : null,
      }
    });

    // Add crew members if provided
    if (body.crewMemberIds && body.crewMemberIds.length > 0) {
      await Promise.all(
        body.crewMemberIds.map((driverId: string) =>
          prisma.crewMember.create({
            data: {
              assignmentId: assignment.id,
              driverId: driverId,
              role: 'CREW'
            }
          })
        )
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}
