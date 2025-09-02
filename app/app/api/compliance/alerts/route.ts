import { NextResponse } from 'next/server';
import { mockComplianceDocuments } from '@/lib/mock-data';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Try database first
    const alerts = await getDbAlerts();
    return NextResponse.json({ alerts });
  } catch (error) {
    // Use mock data if database unavailable
    console.log('Using mock compliance alerts - database not available');
    
    const mockAlerts = mockComplianceDocuments
      .filter(doc => doc.status === 'EXPIRING_SOON' || doc.status === 'EXPIRED')
      .map(doc => ({
        id: doc.id,
        type: doc.type,
        entityType: doc.vehicleId ? 'vehicle' : 'trailer',
        entityId: doc.vehicleId || doc.trailerId,
        documentNumber: doc.documentNumber,
        expiryDate: doc.expiryDate,
        status: doc.status,
        daysUntilExpiry: Math.floor((doc.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        priority: doc.status === 'EXPIRED' ? 'critical' : 'warning'
      }));

    return NextResponse.json({ alerts: mockAlerts });
  }
}

async function getDbAlerts() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const documents = await prisma.complianceDocument.findMany({
    where: {
      OR: [
        { status: 'EXPIRED' },
        { status: 'EXPIRING_SOON' },
        {
          expiryDate: {
            lte: thirtyDaysFromNow
          }
        }
      ]
    },
    include: {
      vehicle: true,
      trailer: true
    },
    orderBy: {
      expiryDate: 'asc'
    }
  });

  return documents.map(doc => ({
    id: doc.id,
    type: doc.type,
    entityType: doc.vehicleId ? 'vehicle' : 'trailer',
    entityId: doc.vehicleId || doc.trailerId,
    entityName: doc.vehicle?.licensePlate || doc.trailer?.licensePlate,
    documentNumber: doc.documentNumber,
    expiryDate: doc.expiryDate,
    status: doc.status,
    daysUntilExpiry: Math.floor((doc.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    priority: doc.status === 'EXPIRED' ? 'critical' : 
              doc.status === 'EXPIRING_SOON' ? 'warning' : 'info'
  }));
}