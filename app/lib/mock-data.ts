// Mock data for ICE Mitigation Services - Toronto-based restoration company

export const mockVehicles = [
  // Trucks for heavy restoration work
  {
    id: 'v1',
    vin: '1GCCS14X1T8123456',
    make: 'Ford',
    model: 'F-350 Super Duty',
    year: 2023,
    licensePlate: 'ICE-001',
    towingCapacityKg: 6350,
    hitchClass: 5,
    hasElectricBrakeController: true,
    status: 'ACTIVE',
    odometer: 12500,
    fuelType: 'Diesel',
    province: 'ON'
  },
  {
    id: 'v2',
    vin: '2FMDK3GC9EBA12345',
    make: 'Chevrolet',
    model: 'Silverado 3500HD',
    year: 2022,
    licensePlate: 'ICE-002',
    towingCapacityKg: 7200,
    hitchClass: 5,
    hasElectricBrakeController: true,
    status: 'ACTIVE',
    odometer: 28000,
    fuelType: 'Diesel',
    province: 'ON'
  },
  {
    id: 'v3',
    vin: '3C6UR5DL8GG123456',
    make: 'RAM',
    model: '3500 Crew Cab',
    year: 2023,
    licensePlate: 'ICE-003',
    towingCapacityKg: 6800,
    hitchClass: 5,
    hasElectricBrakeController: true,
    status: 'ACTIVE',
    odometer: 8900,
    fuelType: 'Diesel',
    province: 'ON'
  },
  {
    id: 'v4',
    vin: '1GC4K0EY5GF123456',
    make: 'GMC',
    model: 'Sierra 2500HD',
    year: 2021,
    licensePlate: 'ICE-004',
    towingCapacityKg: 5900,
    hitchClass: 4,
    hasElectricBrakeController: true,
    status: 'MAINTENANCE',
    odometer: 45600,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v5',
    vin: '1FTFW1ET5GFC12345',
    make: 'Ford',
    model: 'F-250 Super Duty',
    year: 2022,
    licensePlate: 'ICE-005',
    towingCapacityKg: 5800,
    hitchClass: 4,
    hasElectricBrakeController: true,
    status: 'ACTIVE',
    odometer: 31200,
    fuelType: 'Diesel',
    province: 'ON'
  },
  // Cube vans for equipment and supplies
  {
    id: 'v6',
    vin: '1GNSKBKC8GR123456',
    make: 'Ford',
    model: 'E-450 Cube Van',
    year: 2023,
    licensePlate: 'ICE-CV1',
    towingCapacityKg: 2200,
    hitchClass: 2,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 15800,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v7',
    vin: '5FNRL6H97MB123456',
    make: 'GMC',
    model: 'Savana 4500 Cube',
    year: 2022,
    licensePlate: 'ICE-CV2',
    towingCapacityKg: 2500,
    hitchClass: 3,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 22300,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v8',
    vin: '1C6RR7LT4GS123456',
    make: 'Chevrolet',
    model: 'Express 3500 Cube',
    year: 2021,
    licensePlate: 'ICE-CV3',
    towingCapacityKg: 2300,
    hitchClass: 2,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 38900,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  // Service vans
  {
    id: 'v9',
    vin: '1C6RR7LT4GS789012',
    make: 'RAM',
    model: 'ProMaster 2500',
    year: 2023,
    licensePlate: 'ICE-006',
    towingCapacityKg: 1600,
    hitchClass: 2,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 11200,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v10',
    vin: '1FTFW1ET5GFC67890',
    make: 'Ford',
    model: 'Transit 350',
    year: 2022,
    licensePlate: 'ICE-007',
    towingCapacityKg: 1800,
    hitchClass: 2,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 29800,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  // Pickup trucks for crew transport
  {
    id: 'v11',
    vin: '1GCCS14X1T8456789',
    make: 'Chevrolet',
    model: 'Silverado 1500',
    year: 2023,
    licensePlate: 'ICE-008',
    towingCapacityKg: 4200,
    hitchClass: 3,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 18900,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v12',
    vin: '2FMDK3GC9EBA67890',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    licensePlate: 'ICE-009',
    towingCapacityKg: 3900,
    hitchClass: 3,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 35600,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v13',
    vin: '3C6UR5DL8GG456789',
    make: 'RAM',
    model: '1500',
    year: 2021,
    licensePlate: 'ICE-010',
    towingCapacityKg: 3800,
    hitchClass: 3,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 42300,
    fuelType: 'Gasoline',
    province: 'ON'
  },
  {
    id: 'v14',
    vin: '1GC4K0EY5GF456789',
    make: 'GMC',
    model: 'Sierra 1500',
    year: 2023,
    licensePlate: 'ICE-011',
    towingCapacityKg: 4100,
    hitchClass: 3,
    hasElectricBrakeController: false,
    status: 'ACTIVE',
    odometer: 7800,
    fuelType: 'Gasoline',
    province: 'ON'
  }
];

export const mockTrailers = [
  {
    id: 't1',
    serialNumber: 'ICE-TRL-2023-001',
    type: 'EQUIPMENT',
    requiredTowingCapacityKg: 4500,
    requiredHitchClass: 4,
    hasElectricBrakes: true,
    requiresElectricBrakeController: true,
    status: 'ACTIVE',
    licensePlate: 'TRL-001',
    province: 'ON'
  },
  {
    id: 't2',
    serialNumber: 'ICE-TRL-2022-002',
    type: 'ENCLOSED',
    requiredTowingCapacityKg: 3200,
    requiredHitchClass: 3,
    hasElectricBrakes: true,
    requiresElectricBrakeController: true,
    status: 'ACTIVE',
    licensePlate: 'TRL-002',
    province: 'ON'
  }
];

export const mockDrivers = [
  {
    id: 'd1',
    employeeId: 'IMS-001',
    firstName: 'Michael',
    lastName: 'Thompson',
    email: 'mthompson@icemitigationservices.ca',
    phone: '(416) 555-0101',
    licenseNumber: 'T1234-56789-01234',
    licenseClass: 'AZ',
    licenseExpiry: new Date('2025-08-15'),
    endorsements: ['Air Brakes', 'Dangerous Goods'],
    status: 'ACTIVE',
    province: 'ON'
  },
  {
    id: 'd2',
    employeeId: 'IMS-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sjohnson@icemitigationservices.ca',
    phone: '(416) 555-0102',
    licenseNumber: 'J9876-54321-98765',
    licenseClass: 'DZ',
    licenseExpiry: new Date('2024-03-10'),
    endorsements: ['Air Brakes'],
    status: 'ACTIVE',
    province: 'ON'
  },
  {
    id: 'd3',
    employeeId: 'IMS-003',
    firstName: 'David',
    lastName: 'Chen',
    email: 'dchen@icemitigationservices.ca',
    phone: '(416) 555-0103',
    licenseNumber: 'C4567-89012-34567',
    licenseClass: 'G',
    licenseExpiry: new Date('2026-01-20'),
    endorsements: [],
    status: 'ACTIVE',
    province: 'ON'
  },
  {
    id: 'd4',
    employeeId: 'IMS-004',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jmartinez@icemitigationservices.ca',
    phone: '(416) 555-0104',
    licenseNumber: 'M8901-23456-78901',
    licenseClass: 'DZ',
    licenseExpiry: new Date('2024-02-05'),
    endorsements: ['Air Brakes', 'WHMIS'],
    status: 'ACTIVE',
    province: 'ON'
  },
  {
    id: 'd5',
    employeeId: 'IMS-005',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'rwilson@icemitigationservices.ca',
    phone: '(416) 555-0105',
    licenseNumber: 'W2345-67890-12345',
    licenseClass: 'G',
    licenseExpiry: new Date('2025-06-30'),
    endorsements: ['WHMIS'],
    status: 'ACTIVE',
    province: 'ON'
  }
];

export const mockComplianceDocuments = [
  // Vehicle insurance - some expiring soon
  {
    id: 'cd1',
    type: 'INSURANCE',
    documentNumber: 'INS-2024-ICE-001',
    issueDate: new Date('2024-01-01'),
    expiryDate: new Date('2024-02-07'), // 7 days from now
    status: 'EXPIRING_SOON',
    vehicleId: 'v1',
    notes: 'Commercial vehicle insurance - renewal required'
  },
  {
    id: 'cd2',
    type: 'REGISTRATION',
    documentNumber: 'REG-ON-ICE-001',
    issueDate: new Date('2023-02-01'),
    expiryDate: new Date('2024-02-15'), // 15 days from now
    status: 'EXPIRING_SOON',
    vehicleId: 'v2',
    notes: 'Ontario vehicle registration'
  },
  {
    id: 'cd3',
    type: 'INSPECTION',
    documentNumber: 'INSP-2023-ICE-003',
    issueDate: new Date('2023-01-20'),
    expiryDate: new Date('2024-01-20'), // Expired
    status: 'EXPIRED',
    vehicleId: 'v4',
    notes: 'Annual safety inspection - OVERDUE'
  },
  // Trailer documents
  {
    id: 'cd4',
    type: 'REGISTRATION',
    documentNumber: 'TRL-REG-001',
    issueDate: new Date('2023-03-01'),
    expiryDate: new Date('2024-03-01'),
    status: 'VALID',
    trailerId: 't1',
    notes: 'Trailer registration'
  },
  {
    id: 'cd5',
    type: 'INSPECTION',
    documentNumber: 'TRL-INSP-002',
    issueDate: new Date('2023-02-15'),
    expiryDate: new Date('2024-02-28'),
    status: 'EXPIRING_SOON',
    trailerId: 't2',
    notes: 'Annual trailer safety inspection'
  }
];

export const mockMaintenanceRecords = [
  {
    id: 'mr1',
    type: 'PREVENTIVE',
    description: 'Oil change and filter replacement',
    scheduledDate: new Date('2024-02-10'),
    status: 'SCHEDULED',
    vehicleId: 'v1',
    odometer: 15000,
    cost: 185.50,
    serviceProvider: 'Toronto Fleet Services',
    workOrderNumber: 'WO-2024-001'
  },
  {
    id: 'mr2',
    type: 'CORRECTIVE',
    description: 'Brake pad replacement - front',
    scheduledDate: new Date('2024-01-25'),
    completedDate: new Date('2024-01-25'),
    status: 'COMPLETED',
    vehicleId: 'v3',
    odometer: 8500,
    cost: 485.00,
    serviceProvider: 'ICE Fleet Maintenance',
    workOrderNumber: 'WO-2024-002'
  },
  {
    id: 'mr3',
    type: 'EMERGENCY',
    description: 'Engine diagnostic - check engine light',
    scheduledDate: new Date('2024-01-30'),
    status: 'IN_PROGRESS',
    vehicleId: 'v4',
    serviceProvider: 'Diesel Solutions Toronto',
    workOrderNumber: 'WO-2024-003',
    notes: 'Vehicle in shop - awaiting parts'
  },
  {
    id: 'mr4',
    type: 'INSPECTION',
    description: 'Annual safety inspection',
    scheduledDate: new Date('2024-02-20'),
    status: 'OVERDUE',
    trailerId: 't1',
    serviceProvider: 'Ontario Safety Centre',
    workOrderNumber: 'WO-2024-004'
  }
];

// Dashboard statistics
export const mockDashboardStats = {
  fleet: {
    totalVehicles: 14,
    activeVehicles: 12,
    inMaintenance: 1,
    outOfService: 1,
    totalTrailers: 2,
    activeTrailers: 2
  },
  compliance: {
    compliant: 8,
    expiringSoon: 4,
    expired: 2,
    renewalsDue30Days: 6
  },
  maintenance: {
    scheduled: 2,
    overdue: 1,
    completedThisMonth: 3,
    totalCostThisMonth: 1155.50
  },
  utilization: {
    averageUtilization: 78,
    vehiclesInUse: 10,
    availableNow: 4
  }
};