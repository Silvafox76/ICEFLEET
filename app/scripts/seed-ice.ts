import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database...');
  
  // Clear in correct order
  await prisma.compatibilityCheck.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.complianceDocument.deleteMany();
  await prisma.crewMember.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.trailer.deleteMany();
  await prisma.vehicle.deleteMany();

  console.log('🚚 Creating ICE Mitigation Services fleet...');

  // Create 14 vehicles
  const vehicles = await Promise.all([
    // Heavy duty trucks (5)
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    // Cube vans (3)
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    // Service vans (2)
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    // Pickup trucks (4)
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
      }
    }),
    prisma.vehicle.create({
      data: {
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
    })
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // Create 2 trailers
  const trailers = await Promise.all([
    prisma.trailer.create({
      data: {
        serialNumber: 'ICE-TRL-2023-001',
        type: 'EQUIPMENT',
        requiredTowingCapacityKg: 4500,
        requiredHitchClass: 4,
        hasElectricBrakes: true,
        requiresElectricBrakeController: true,
        status: 'ACTIVE',
        licensePlate: 'TRL-001',
        province: 'ON'
      }
    }),
    prisma.trailer.create({
      data: {
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
    })
  ]);

  console.log(`✅ Created ${trailers.length} trailers`);

  // Create 5 drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        employeeId: 'IMS-001',
        firstName: 'Michael',
        lastName: 'Thompson',
        email: 'mthompson@icemitigationservices.ca',
        phone: '(416) 555-0101',
        licenseNumber: 'T1234-56789-01234',
        licenseClass: 'AZ',
        licenseExpiry: new Date('2025-08-15'),
        endorsements: JSON.stringify(['Air Brakes', 'Dangerous Goods']),
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'IMS-002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sjohnson@icemitigationservices.ca',
        phone: '(416) 555-0102',
        licenseNumber: 'J9876-54321-98765',
        licenseClass: 'DZ',
        licenseExpiry: new Date('2024-03-10'),
        endorsements: JSON.stringify(['Air Brakes']),
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'IMS-003',
        firstName: 'David',
        lastName: 'Chen',
        email: 'dchen@icemitigationservices.ca',
        phone: '(416) 555-0103',
        licenseNumber: 'C4567-89012-34567',
        licenseClass: 'G',
        licenseExpiry: new Date('2026-01-20'),
        endorsements: JSON.stringify([]),
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'IMS-004',
        firstName: 'Jennifer',
        lastName: 'Martinez',
        email: 'jmartinez@icemitigationservices.ca',
        phone: '(416) 555-0104',
        licenseNumber: 'M8901-23456-78901',
        licenseClass: 'DZ',
        licenseExpiry: new Date('2024-02-05'),
        endorsements: JSON.stringify(['Air Brakes', 'WHMIS']),
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'IMS-005',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'rwilson@icemitigationservices.ca',
        phone: '(416) 555-0105',
        licenseNumber: 'W2345-67890-12345',
        licenseClass: 'G',
        licenseExpiry: new Date('2025-06-30'),
        endorsements: JSON.stringify(['WHMIS']),
        status: 'ACTIVE',
        province: 'ON'
      }
    })
  ]);

  console.log(`✅ Created ${drivers.length} drivers`);

  // Create compliance documents with various expiry dates
  const now = new Date();
  const complianceDocuments = await Promise.all([
    // Vehicle insurance - expiring soon
    prisma.complianceDocument.create({
      data: {
        type: 'INSURANCE',
        documentNumber: 'INS-2024-ICE-001',
        issueDate: new Date('2024-01-01'),
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'EXPIRING_SOON',
        vehicleId: vehicles[0].id,
        notes: 'Commercial vehicle insurance - renewal required'
      }
    }),
    prisma.complianceDocument.create({
      data: {
        type: 'REGISTRATION',
        documentNumber: 'REG-ON-ICE-002',
        issueDate: new Date('2023-02-01'),
        expiryDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: 'EXPIRING_SOON',
        vehicleId: vehicles[1].id,
        notes: 'Ontario vehicle registration'
      }
    }),
    prisma.complianceDocument.create({
      data: {
        type: 'INSPECTION',
        documentNumber: 'INSP-2023-ICE-004',
        issueDate: new Date('2023-01-20'),
        expiryDate: new Date('2024-01-20'), // Expired
        status: 'EXPIRED',
        vehicleId: vehicles[3].id,
        notes: 'Annual safety inspection - OVERDUE'
      }
    }),
    // Trailer documents
    prisma.complianceDocument.create({
      data: {
        type: 'REGISTRATION',
        documentNumber: 'TRL-REG-001',
        issueDate: new Date('2023-03-01'),
        expiryDate: new Date('2025-03-01'),
        status: 'VALID',
        trailerId: trailers[0].id,
        notes: 'Trailer registration'
      }
    }),
    prisma.complianceDocument.create({
      data: {
        type: 'INSPECTION',
        documentNumber: 'TRL-INSP-002',
        issueDate: new Date('2023-02-15'),
        expiryDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
        status: 'EXPIRING_SOON',
        trailerId: trailers[1].id,
        notes: 'Annual trailer safety inspection'
      }
    })
  ]);

  console.log(`✅ Created ${complianceDocuments.length} compliance documents`);

  // Create maintenance records
  const maintenanceRecords = await Promise.all([
    prisma.maintenanceRecord.create({
      data: {
        type: 'PREVENTIVE',
        description: 'Oil change and filter replacement',
        scheduledDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: 'SCHEDULED',
        vehicleId: vehicles[0].id,
        odometer: 15000,
        cost: 185.50,
        serviceProvider: 'Toronto Fleet Services',
        workOrderNumber: 'WO-2024-001'
      }
    }),
    prisma.maintenanceRecord.create({
      data: {
        type: 'CORRECTIVE',
        description: 'Brake pad replacement - front',
        scheduledDate: new Date('2024-01-25'),
        completedDate: new Date('2024-01-25'),
        status: 'COMPLETED',
        vehicleId: vehicles[2].id,
        odometer: 8500,
        cost: 485.00,
        serviceProvider: 'ICE Fleet Maintenance',
        workOrderNumber: 'WO-2024-002'
      }
    }),
    prisma.maintenanceRecord.create({
      data: {
        type: 'EMERGENCY',
        description: 'Engine diagnostic - check engine light',
        scheduledDate: new Date('2024-01-30'),
        status: 'IN_PROGRESS',
        vehicleId: vehicles[3].id,
        serviceProvider: 'Diesel Solutions Toronto',
        workOrderNumber: 'WO-2024-003',
        notes: 'Vehicle in shop - awaiting parts'
      }
    })
  ]);

  console.log(`✅ Created ${maintenanceRecords.length} maintenance records`);

  console.log('\n🎉 ICE Mitigation Services fleet database seeded successfully!');
  console.log('📊 Summary:');
  console.log(`   - 14 Vehicles (5 heavy trucks, 3 cube vans, 2 service vans, 4 pickups)`);
  console.log(`   - 2 Heavy-duty trailers`);
  console.log(`   - 5 Licensed drivers`);
  console.log(`   - ${complianceDocuments.length} Compliance documents (with expiry alerts)`);
  console.log(`   - ${maintenanceRecords.length} Maintenance records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });