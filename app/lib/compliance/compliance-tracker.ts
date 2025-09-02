import { ComplianceDocument, Vehicle, Trailer, Driver } from '@/lib/types';

export interface RenewalAlert {
  id: string;
  type: 'DOCUMENT' | 'LICENSE' | 'REGISTRATION' | 'INSPECTION' | 'INSURANCE';
  title: string;
  description: string;
  assetType: 'VEHICLE' | 'TRAILER' | 'DRIVER';
  assetId: string;
  assetName: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'red' | 'amber' | 'green';
  actionRequired?: string;
  documentId?: string;
}

export interface ComplianceStatus {
  overall: 'COMPLIANT' | 'WARNING' | 'CRITICAL';
  totalAssets: number;
  compliantAssets: number;
  warningAssets: number;
  criticalAssets: number;
  expiringDocuments: number;
  expiredDocuments: number;
  upcomingRenewals: RenewalAlert[];
}

export interface ProvincialRequirement {
  province: string;
  requirement: string;
  documentType: string;
  renewalPeriod: number; // in months
  warningPeriods: number[]; // days before expiry to alert
  isMandatory: boolean;
}

// Provincial compliance requirements for Canadian provinces
export const PROVINCIAL_REQUIREMENTS: Record<string, ProvincialRequirement[]> = {
  'ON': [
    {
      province: 'Ontario',
      requirement: 'Vehicle Registration',
      documentType: 'REGISTRATION',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'Ontario',
      requirement: 'Commercial Vehicle Insurance',
      documentType: 'INSURANCE',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'Ontario',
      requirement: 'Commercial Vehicle Safety Inspection',
      documentType: 'INSPECTION',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'Ontario',
      requirement: 'Commercial Vehicle Permit',
      documentType: 'COMMERCIAL_PERMIT',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    }
  ],
  'AB': [
    {
      province: 'Alberta',
      requirement: 'Vehicle Registration',
      documentType: 'REGISTRATION',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'Alberta',
      requirement: 'Commercial Vehicle Insurance',
      documentType: 'INSURANCE',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'Alberta',
      requirement: 'Commercial Vehicle Safety Inspection',
      documentType: 'INSPECTION',
      renewalPeriod: 6, // Alberta requires 6-month inspections
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    }
  ],
  'BC': [
    {
      province: 'British Columbia',
      requirement: 'Vehicle Registration',
      documentType: 'REGISTRATION',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'British Columbia',
      requirement: 'Commercial Vehicle Insurance',
      documentType: 'INSURANCE',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    },
    {
      province: 'British Columbia',
      requirement: 'Commercial Vehicle Safety Inspection',
      documentType: 'INSPECTION',
      renewalPeriod: 12,
      warningPeriods: [90, 60, 30, 14, 7, 3, 1],
      isMandatory: true
    }
  ]
};

/**
 * Calculate days until expiry with proper date handling
 */
export function calculateDaysUntilExpiry(expiryDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Get compliance status based on days until expiry
 */
export function getComplianceStatus(daysUntilExpiry: number): 'green' | 'amber' | 'red' {
  if (daysUntilExpiry <= 0) return 'red'; // Expired
  if (daysUntilExpiry <= 7) return 'red'; // Critical - 7 days or less
  if (daysUntilExpiry <= 30) return 'amber'; // Warning - 30 days or less
  return 'green'; // Good - more than 30 days
}

/**
 * Get priority level based on days until expiry
 */
export function getPriorityLevel(daysUntilExpiry: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (daysUntilExpiry <= 0) return 'CRITICAL'; // Expired
  if (daysUntilExpiry <= 3) return 'CRITICAL'; // 3 days or less
  if (daysUntilExpiry <= 7) return 'HIGH'; // 7 days or less
  if (daysUntilExpiry <= 14) return 'HIGH'; // 14 days or less
  if (daysUntilExpiry <= 30) return 'MEDIUM'; // 30 days or less
  return 'LOW'; // More than 30 days
}

/**
 * Generate renewal alerts for documents
 */
export function generateDocumentRenewals(
  documents: (ComplianceDocument & { vehicle?: Vehicle; trailer?: Trailer })[]
): RenewalAlert[] {
  const alerts: RenewalAlert[] = [];
  const today = new Date();

  documents.forEach(doc => {
    const daysUntilExpiry = calculateDaysUntilExpiry(doc.expiryDate);
    const status = getComplianceStatus(daysUntilExpiry);
    const priority = getPriorityLevel(daysUntilExpiry);

    // Only create alerts for documents expiring within 90 days or already expired
    if (daysUntilExpiry <= 90) {
      let assetName = 'Unknown Asset';
      let assetType: 'VEHICLE' | 'TRAILER' | 'DRIVER' = 'VEHICLE';

      if (doc.vehicle) {
        assetName = `${doc.vehicle.make} ${doc.vehicle.model} (${doc.vehicle.licensePlate})`;
        assetType = 'VEHICLE';
      } else if (doc.trailer) {
        assetName = `${doc.trailer.type} Trailer (${doc.trailer.serialNumber})`;
        assetType = 'TRAILER';
      }

      const docTypeDisplayName = doc.type.replace('_', ' ').toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());

      alerts.push({
        id: `doc-${doc.id}`,
        type: 'DOCUMENT',
        title: `${docTypeDisplayName} Renewal Required`,
        description: daysUntilExpiry <= 0 
          ? `${docTypeDisplayName} has expired` 
          : `${docTypeDisplayName} expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`,
        assetType,
        assetId: doc.vehicleId || doc.trailerId || '',
        assetName,
        expiryDate: doc.expiryDate,
        daysUntilExpiry,
        priority,
        status,
        actionRequired: daysUntilExpiry <= 0 
          ? 'Renew immediately - asset may be out of compliance'
          : `Schedule renewal for ${docTypeDisplayName}`,
        documentId: doc.id
      });
    }
  });

  return alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

/**
 * Generate renewal alerts for driver licenses
 */
export function generateDriverLicenseRenewals(drivers: Driver[]): RenewalAlert[] {
  const alerts: RenewalAlert[] = [];

  drivers
    .filter(driver => driver.status === 'ACTIVE')
    .forEach(driver => {
      const daysUntilExpiry = calculateDaysUntilExpiry(driver.licenseExpiry);
      const status = getComplianceStatus(daysUntilExpiry);
      const priority = getPriorityLevel(daysUntilExpiry);

      // Only create alerts for licenses expiring within 90 days or already expired
      if (daysUntilExpiry <= 90) {
        alerts.push({
          id: `license-${driver.id}`,
          type: 'LICENSE',
          title: 'Driver License Renewal Required',
          description: daysUntilExpiry <= 0 
            ? `Driver license has expired` 
            : `Driver license expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`,
          assetType: 'DRIVER',
          assetId: driver.id,
          assetName: `${driver.firstName} ${driver.lastName} (${driver.employeeId})`,
          expiryDate: driver.licenseExpiry,
          daysUntilExpiry,
          priority,
          status,
          actionRequired: daysUntilExpiry <= 0 
            ? 'Driver must renew license immediately - cannot operate vehicles'
            : 'Schedule license renewal appointment'
        });
      }
    });

  return alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

/**
 * Calculate overall compliance status for fleet
 */
export function calculateComplianceStatus(
  vehicles: Vehicle[],
  trailers: Trailer[],
  drivers: Driver[],
  documents: (ComplianceDocument & { vehicle?: Vehicle; trailer?: Trailer })[]
): ComplianceStatus {
  const allRenewals = [
    ...generateDocumentRenewals(documents),
    ...generateDriverLicenseRenewals(drivers)
  ];

  const totalAssets = vehicles.length + trailers.length + drivers.filter(d => d.status === 'ACTIVE').length;
  
  // Count assets by compliance status
  const assetCompliance = new Map<string, 'green' | 'amber' | 'red'>();

  // Initialize all assets as compliant
  vehicles.forEach(v => assetCompliance.set(`vehicle-${v.id}`, 'green'));
  trailers.forEach(t => assetCompliance.set(`trailer-${t.id}`, 'green'));
  drivers.filter(d => d.status === 'ACTIVE').forEach(d => assetCompliance.set(`driver-${d.id}`, 'green'));

  // Update status based on renewals
  allRenewals.forEach(renewal => {
    const assetKey = `${renewal.assetType.toLowerCase()}-${renewal.assetId}`;
    const currentStatus = assetCompliance.get(assetKey) || 'green';
    
    // Only update if new status is worse
    if (renewal.status === 'red' || (renewal.status === 'amber' && currentStatus === 'green')) {
      assetCompliance.set(assetKey, renewal.status);
    }
  });

  const compliantAssets = Array.from(assetCompliance.values()).filter(status => status === 'green').length;
  const warningAssets = Array.from(assetCompliance.values()).filter(status => status === 'amber').length;
  const criticalAssets = Array.from(assetCompliance.values()).filter(status => status === 'red').length;

  const expiredDocuments = allRenewals.filter(r => r.daysUntilExpiry <= 0).length;
  const expiringDocuments = allRenewals.filter(r => r.daysUntilExpiry > 0 && r.daysUntilExpiry <= 30).length;

  let overall: 'COMPLIANT' | 'WARNING' | 'CRITICAL';
  if (criticalAssets > 0) {
    overall = 'CRITICAL';
  } else if (warningAssets > 0) {
    overall = 'WARNING';
  } else {
    overall = 'COMPLIANT';
  }

  return {
    overall,
    totalAssets,
    compliantAssets,
    warningAssets,
    criticalAssets,
    expiringDocuments,
    expiredDocuments,
    upcomingRenewals: allRenewals
  };
}

/**
 * Validate provincial requirements for a vehicle/trailer
 */
export function validateProvincialRequirements(
  province: string,
  assetType: 'VEHICLE' | 'TRAILER',
  documents: ComplianceDocument[]
): { requirement: ProvincialRequirement; hasValidDocument: boolean; document?: ComplianceDocument }[] {
  const requirements = PROVINCIAL_REQUIREMENTS[province] || [];
  
  return requirements.map(requirement => {
    const matchingDocs = documents.filter(doc => 
      doc.type === requirement.documentType && 
      calculateDaysUntilExpiry(doc.expiryDate) > 0
    );

    const validDocument = matchingDocs.length > 0 ? matchingDocs[0] : undefined;

    return {
      requirement,
      hasValidDocument: validDocument !== undefined,
      document: validDocument
    };
  });
}

/**
 * Get renewal timeline for planning purposes
 */
export function getRenewalTimeline(
  documents: (ComplianceDocument & { vehicle?: Vehicle; trailer?: Trailer })[],
  drivers: Driver[]
): { month: string; renewals: RenewalAlert[] }[] {
  const allRenewals = [
    ...generateDocumentRenewals(documents),
    ...generateDriverLicenseRenewals(drivers)
  ];

  // Group renewals by month for next 12 months
  const timeline: { month: string; renewals: RenewalAlert[] }[] = [];
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthName = monthDate.toLocaleDateString('en-CA', { 
      year: 'numeric', 
      month: 'long' 
    });

    const monthRenewals = allRenewals.filter(renewal => {
      const renewalDate = new Date(renewal.expiryDate);
      return renewalDate.getMonth() === monthDate.getMonth() && 
             renewalDate.getFullYear() === monthDate.getFullYear();
    });

    timeline.push({
      month: monthName,
      renewals: monthRenewals
    });
  }

  return timeline;
}