
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: [
        { status: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
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

    // Parse endorsements JSON string for each driver
    const driversWithParsedEndorsements = drivers.map(driver => ({
      ...driver,
      endorsements: typeof driver.endorsements === 'string' 
        ? JSON.parse(driver.endorsements) 
        : driver.endorsements
    }));

    return NextResponse.json(driversWithParsedEndorsements || []);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const driver = await prisma.driver.create({
      data: {
        employeeId: body.employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        licenseNumber: body.licenseNumber,
        licenseClass: body.licenseClass,
        licenseExpiry: new Date(body.licenseExpiry),
        endorsements: JSON.stringify(body.endorsements || []),
        province: body.province,
        status: body.status || 'ACTIVE'
      }
    });

    return NextResponse.json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    );
  }
}
