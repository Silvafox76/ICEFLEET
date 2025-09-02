import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { 
  generateDocumentRenewals, 
  generateDriverLicenseRenewals,
  getRenewalTimeline 
} from '@/lib/compliance/compliance-tracker';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'upcoming'; // upcoming, timeline, critical
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 90;

    // Fetch all necessary data
    const [documents, drivers] = await Promise.all([
      prisma.complianceDocument.findMany({
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              licensePlate: true,
              province: true
            }
          },
          trailer: {
            select: {
              id: true,
              type: true,
              serialNumber: true,
              province: true
            }
          }
        }
      }),
      prisma.driver.findMany({
        where: {
          status: 'ACTIVE'
        },
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          licenseNumber: true,
          licenseClass: true,
          licenseExpiry: true,
          province: true
        }
      })
    ]);

    switch (filter) {
      case 'timeline':
        // Return renewal timeline for planning
        const timeline = getRenewalTimeline(documents, drivers);
        return NextResponse.json(timeline);

      case 'critical':
        // Return only critical renewals (expired or expiring within 7 days)
        const documentRenewals = generateDocumentRenewals(documents);
        const licenseRenewals = generateDriverLicenseRenewals(drivers);
        const allRenewals = [...documentRenewals, ...licenseRenewals];
        
        const criticalRenewals = allRenewals.filter(renewal => 
          renewal.daysUntilExpiry <= 7 || renewal.status === 'red'
        );

        return NextResponse.json(criticalRenewals);

      case 'upcoming':
      default:
        // Return all renewals within specified days (default 90)
        const docRenewals = generateDocumentRenewals(documents);
        const driverRenewals = generateDriverLicenseRenewals(drivers);
        const upcomingRenewals = [...docRenewals, ...driverRenewals].filter(renewal => 
          renewal.daysUntilExpiry <= days
        );

        // Group by priority for better organization
        const groupedRenewals = {
          critical: upcomingRenewals.filter(r => r.priority === 'CRITICAL'),
          high: upcomingRenewals.filter(r => r.priority === 'HIGH'),
          medium: upcomingRenewals.filter(r => r.priority === 'MEDIUM'),
          low: upcomingRenewals.filter(r => r.priority === 'LOW'),
          all: upcomingRenewals
        };

        return NextResponse.json(groupedRenewals);
    }
  } catch (error) {
    console.error('Error fetching renewal data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch renewal data' },
      { status: 500 }
    );
  }
}