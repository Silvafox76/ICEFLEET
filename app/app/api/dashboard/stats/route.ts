import { NextResponse } from 'next/server';
import { mockDashboardStats } from '@/lib/mock-data';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Try to get real data from database
    const stats = await getDbStats();
    return NextResponse.json(stats);
  } catch (error) {
    // Database not available, use mock data
    console.log('Using mock dashboard stats - database not available');
    return NextResponse.json(mockDashboardStats);
  }
}

async function getDbStats() {
  try {
    const [
      totalVehicles,
      activeVehicles,
      totalTrailers,
      totalDrivers,
      complianceDocuments,
      maintenanceRecords
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'ACTIVE' } }),
      prisma.trailer.count(),
      prisma.driver.count({ where: { status: 'ACTIVE' } }),
      prisma.complianceDocument.findMany({
        where: {
          expiryDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.maintenanceRecord.findMany({
        where: {
          status: { in: ['SCHEDULED', 'OVERDUE'] }
        }
      })
    ]);

    const expiringSoon = complianceDocuments.filter(doc => {
      const daysUntilExpiry = Math.floor((doc.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    const expired = complianceDocuments.filter(doc => doc.expiryDate < new Date()).length;

    return {
      fleet: {
        totalVehicles,
        activeVehicles,
        inMaintenance: totalVehicles - activeVehicles,
        totalTrailers,
        totalDrivers
      },
      compliance: {
        compliant: totalVehicles - expiringSoon - expired,
        expiringSoon,
        expired,
        renewalsDue30Days: complianceDocuments.length
      },
      maintenance: {
        scheduled: maintenanceRecords.filter(r => r.status === 'SCHEDULED').length,
        overdue: maintenanceRecords.filter(r => r.status === 'OVERDUE').length
      },
      utilization: {
        averageUtilization: 75,
        vehiclesInUse: Math.floor(activeVehicles * 0.75)
      }
    };
  } catch (error) {
    throw error;
  }
}