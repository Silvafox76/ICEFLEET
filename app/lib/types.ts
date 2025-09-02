
// Fleet Management Types
export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  towingCapacity: number;
  hitchClass: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
  odometer: number;
  fuelType: string;
  province: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trailer {
  id: string;
  serialNumber: string;
  type: 'ENCLOSED' | 'FLATBED' | 'UTILITY' | 'EQUIPMENT' | 'SPECIALTY';
  requiredTowingCapacity: number;
  requiredHitchClass: string;
  hasBrakes: boolean;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
  licensePlate?: string;
  province: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: Date;
  endorsements: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  province: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  jobNumber: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  vehicleId?: string;
  trailerId?: string;
  leadDriverId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceDocument {
  id: string;
  type: 'INSURANCE' | 'REGISTRATION' | 'INSPECTION' | 'COMMERCIAL_PERMIT' | 'SPECIAL_PERMIT';
  documentNumber: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON' | 'SUSPENDED' | 'CANCELLED';
  vehicleId?: string;
  trailerId?: string;
  cloudStoragePath?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION' | 'RECALL';
  description: string;
  scheduledDate?: Date;
  completedDate?: Date;
  odometer?: number;
  cost?: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  vehicleId?: string;
  trailerId?: string;
  serviceProvider?: string;
  workOrderNumber?: string;
  notes?: string;
  cloudStoragePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalVehicles: number;
  totalTrailers: number;
  totalDrivers: number;
  activeAssignments: number;
  complianceAlerts: number;
  maintenanceOverdue: number;
  vehicleUtilization: number;
}

export interface ComplianceAlert {
  id: string;
  type: string;
  asset: string;
  description: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  status: 'green' | 'amber' | 'red';
}

// Canadian Provinces
export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' },
] as const;

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-CA').format(new Date(date));
};

export const calculateDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getComplianceStatus = (daysUntilExpiry: number): 'green' | 'amber' | 'red' => {
  if (daysUntilExpiry >= 30) return 'green';
  if (daysUntilExpiry >= 8) return 'amber';
  return 'red';
};
