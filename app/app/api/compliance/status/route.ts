import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { 
  calculateComplianceStatus,
  validateProvincialRequirements,
  PROVINCIAL_REQUIREMENTS
} from '@/lib/compliance/compliance-tracker';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const assetType = searchParams.get('assetType') as 'VEHICLE' | 'TRAILER' | 'DRIVER' | null;
    const detailed = searchParams.get('detailed') === 'true';

    if (assetId && assetType) {
      // Get status for specific asset
      return getAssetComplianceStatus(assetId, assetType, detailed);
    } else {
      // Get overall fleet compliance status
      return getFleetComplianceStatus(detailed);
    }
  } catch (error) {
    console.error('Error fetching compliance status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance status' },
      { status: 500 }
    );
  }
}

async function getFleetComplianceStatus(detailed: boolean) {
  // Fetch all fleet data
  const [vehicles, trailers, drivers, documents] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: { not: 'RETIRED' } },
      select: {
        id: true,
        make: true,
        model: true,
        licensePlate: true,
        province: true,
        status: true
      }
    }),
    prisma.trailer.findMany({
      where: { status: { not: 'RETIRED' } },
      select: {
        id: true,
        type: true,
        serialNumber: true,
        province: true,
        status: true
      }
    }),
    prisma.driver.findMany({
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        licenseNumber: true,
        licenseClass: true,
        licenseExpiry: true,
        status: true,
        province: true
      }
    }),
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
    })
  ]);

  const complianceStatus = calculateComplianceStatus(vehicles, trailers, drivers, documents);

  if (!detailed) {
    return NextResponse.json(complianceStatus);
  }

  // Add detailed breakdown by province and asset type
  const provinceBreakdown = new Map<string, any>();
  const assetTypeBreakdown = {
    vehicles: { total: vehicles.length, compliant: 0, warning: 0, critical: 0 },
    trailers: { total: trailers.length, compliant: 0, warning: 0, critical: 0 },
    drivers: { total: drivers.filter((d: any) => d.status === 'ACTIVE').length, compliant: 0, warning: 0, critical: 0 }
  };

  // Calculate province-specific compliance
  const allProvinces = [...new Set([
    ...vehicles.map((v: any) => v.province),
    ...trailers.map((t: any) => t.province),
    ...drivers.map((d: any) => d.province)
  ])];

  for (const province of allProvinces) {
    const provinceVehicles = vehicles.filter((v: any) => v.province === province);
    const provinceTrailers = trailers.filter((t: any) => t.province === province);
    const provinceDrivers = drivers.filter((d: any) => d.province === province);
    const provinceDocuments = documents.filter((d: any) => 
      (d.vehicle && d.vehicle.province === province) || 
      (d.trailer && d.trailer.province === province)
    );

    const provinceStatus = calculateComplianceStatus(
      provinceVehicles, 
      provinceTrailers, 
      provinceDrivers, 
      provinceDocuments
    );

    provinceBreakdown.set(province, {
      province,
      status: provinceStatus,
      requirements: PROVINCIAL_REQUIREMENTS[province] || []
    });
  }

  return NextResponse.json({
    ...complianceStatus,
    detailed: {
      provinceBreakdown: Object.fromEntries(provinceBreakdown),
      assetTypeBreakdown
    }
  });
}

async function getAssetComplianceStatus(assetId: string, assetType: 'VEHICLE' | 'TRAILER' | 'DRIVER', detailed: boolean) {
  let asset: any = null;
  let documents: any[] = [];

  switch (assetType) {
    case 'VEHICLE':
      asset = await prisma.vehicle.findUnique({
        where: { id: assetId },
        include: {
          complianceDocuments: {
            orderBy: { expiryDate: 'asc' }
          }
        }
      });
      documents = asset?.complianceDocuments || [];
      break;

    case 'TRAILER':
      asset = await prisma.trailer.findUnique({
        where: { id: assetId },
        include: {
          complianceDocuments: {
            orderBy: { expiryDate: 'asc' }
          }
        }
      });
      documents = asset?.complianceDocuments || [];
      break;

    case 'DRIVER':
      asset = await prisma.driver.findUnique({
        where: { id: assetId }
      });
      documents = []; // Drivers don't have documents in the same way
      break;

    default:
      return NextResponse.json({ error: 'Invalid asset type' }, { status: 400 });
  }

  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  // Calculate compliance for this specific asset
  const singleAssetCompliance = calculateComplianceStatus(
    assetType === 'VEHICLE' ? [asset] : [],
    assetType === 'TRAILER' ? [asset] : [],
    assetType === 'DRIVER' ? [asset] : [],
    assetType !== 'DRIVER' ? documents.map(d => ({ ...d, [assetType.toLowerCase()]: asset })) : []
  );

  if (!detailed) {
    return NextResponse.json({
      assetId,
      assetType,
      assetName: assetType === 'DRIVER' 
        ? `${asset.firstName} ${asset.lastName}`
        : assetType === 'VEHICLE'
        ? `${asset.make} ${asset.model} (${asset.licensePlate})`
        : `${asset.type} Trailer (${asset.serialNumber})`,
      compliance: singleAssetCompliance
    });
  }

  // Add detailed provincial requirements validation
  let provincialValidation: any[] = [];
  if (assetType !== 'DRIVER' && asset.province) {
    provincialValidation = validateProvincialRequirements(
      asset.province,
      assetType,
      documents
    );
  }

  return NextResponse.json({
    assetId,
    assetType,
    assetName: assetType === 'DRIVER' 
      ? `${asset.firstName} ${asset.lastName}`
      : assetType === 'VEHICLE'
      ? `${asset.make} ${asset.model} (${asset.licensePlate})`
      : `${asset.type} Trailer (${asset.serialNumber})`,
    compliance: singleAssetCompliance,
    detailed: {
      asset,
      documents,
      provincialValidation,
      province: asset.province
    }
  });
}