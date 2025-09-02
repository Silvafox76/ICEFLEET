
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ICE Fleet Management database with Canadian sample data...');

  // Clear existing data in correct order
  console.log('🧹 Clearing existing data...');
  await prisma.crewMember.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.complianceDocument.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.trailer.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.formSubmission.deleteMany();

  // 1. Seed Vehicles - Canadian restoration company fleet
  console.log('🚚 Seeding vehicles...');
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        vin: '1GCCS14X1T8123456',
        make: 'Chevrolet',
        model: 'Silverado 2500HD',
        year: 2023,
        licensePlate: 'ABC123',
        towingCapacity: 4500,
        hitchClass: 'Class IV',
        status: 'ACTIVE',
        odometer: 15234,
        fuelType: 'Gasoline',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '2FMDK3GC9EBA12345',
        make: 'Ford',
        model: 'F-350 Super Duty',
        year: 2022,
        licensePlate: 'DEF456',
        towingCapacity: 5900,
        hitchClass: 'Class V',
        status: 'ACTIVE',
        odometer: 28445,
        fuelType: 'Diesel',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '3C6UR5DL8GG123456',
        make: 'RAM',
        model: '3500 Crew Cab',
        year: 2021,
        licensePlate: 'GHI789',
        towingCapacity: 6800,
        hitchClass: 'Class V',
        status: 'ACTIVE',
        odometer: 45678,
        fuelType: 'Diesel',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '1GC4K0EY5GF123456',
        make: 'GMC',
        model: 'Sierra 2500HD',
        year: 2020,
        licensePlate: 'JKL012',
        towingCapacity: 4200,
        hitchClass: 'Class IV',
        status: 'MAINTENANCE',
        odometer: 67890,
        fuelType: 'Gasoline',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '1FTFW1ET5GFC12345',
        make: 'Ford',
        model: 'F-450 Super Duty',
        year: 2024,
        licensePlate: 'MNO345',
        towingCapacity: 7300,
        hitchClass: 'Class V',
        status: 'ACTIVE',
        odometer: 5430,
        fuelType: 'Diesel',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '1GNSKBKC8GR123456',
        make: 'Chevrolet',
        model: 'Tahoe',
        year: 2023,
        licensePlate: 'PQR678',
        towingCapacity: 3800,
        hitchClass: 'Class III',
        status: 'ACTIVE',
        odometer: 12456,
        fuelType: 'Gasoline',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '5FNRL6H97MB123456',
        make: 'Honda',
        model: 'Ridgeline',
        year: 2022,
        licensePlate: 'STU901',
        towingCapacity: 2300,
        hitchClass: 'Class III',
        status: 'ACTIVE',
        odometer: 34567,
        fuelType: 'Gasoline',
        province: 'ON'
      }
    }),
    prisma.vehicle.create({
      data: {
        vin: '1C6RR7LT4GS123456',
        make: 'RAM',
        model: '1500 Classic',
        year: 2019,
        licensePlate: 'VWX234',
        towingCapacity: 3900,
        hitchClass: 'Class IV',
        status: 'OUT_OF_SERVICE',
        odometer: 89234,
        fuelType: 'Gasoline',
        province: 'ON'
      }
    })
  ]);

  // 2. Seed Trailers - Restoration equipment trailers
  console.log('📦 Seeding trailers...');
  const trailers = await Promise.all([
    prisma.trailer.create({
      data: {
        serialNumber: 'ENC2023001',
        type: 'ENCLOSED',
        requiredTowingCapacity: 2700,
        requiredHitchClass: 'Class IV',
        hasBrakes: true,
        status: 'ACTIVE',
        licensePlate: 'TRL001',
        province: 'ON'
      }
    }),
    prisma.trailer.create({
      data: {
        serialNumber: 'ENC2023002',
        type: 'ENCLOSED',
        requiredTowingCapacity: 3200,
        requiredHitchClass: 'Class IV',
        hasBrakes: true,
        status: 'ACTIVE',
        licensePlate: 'TRL002',
        province: 'ON'
      }
    }),
    prisma.trailer.create({
      data: {
        serialNumber: 'FLT2022001',
        type: 'FLATBED',
        requiredTowingCapacity: 4100,
        requiredHitchClass: 'Class V',
        hasBrakes: true,
        status: 'ACTIVE',
        licensePlate: 'TRL003',
        province: 'ON'
      }
    }),
    prisma.trailer.create({
      data: {
        serialNumber: 'EQP2023001',
        type: 'EQUIPMENT',
        requiredTowingCapacity: 5200,
        requiredHitchClass: 'Class V',
        hasBrakes: true,
        status: 'ACTIVE',
        licensePlate: 'TRL004',
        province: 'ON'
      }
    }),
    prisma.trailer.create({
      data: {
        serialNumber: 'UTL2021001',
        type: 'UTILITY',
        requiredTowingCapacity: 1800,
        requiredHitchClass: 'Class III',
        hasBrakes: false,
        status: 'MAINTENANCE',
        licensePlate: 'TRL005',
        province: 'ON'
      }
    }),
    prisma.trailer.create({
      data: {
        serialNumber: 'SPC2024001',
        type: 'SPECIALTY',
        requiredTowingCapacity: 6200,
        requiredHitchClass: 'Class V',
        hasBrakes: true,
        status: 'ACTIVE',
        licensePlate: 'TRL006',
        province: 'ON'
      }
    })
  ]);

  // 3. Seed Drivers - Canadian restoration company crew
  console.log('👥 Seeding drivers...');
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        employeeId: 'ICE001',
        firstName: 'Michael',
        lastName: 'Thompson',
        email: 'mthompson@icemitigation.ca',
        phone: '(416) 555-0101',
        licenseNumber: 'T123456789012',
        licenseClass: 'AZ',
        licenseExpiry: new Date('2025-08-15'),
        endorsements: ['Air Brakes', 'Dangerous Goods'],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE002',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'schen@icemitigation.ca',
        phone: '(416) 555-0102',
        licenseNumber: 'C987654321098',
        licenseClass: 'DZ',
        licenseExpiry: new Date('2025-11-22'),
        endorsements: ['Air Brakes'],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE003',
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'drodriguez@icemitigation.ca',
        phone: '(416) 555-0103',
        licenseNumber: 'R456789123456',
        licenseClass: 'G',
        licenseExpiry: new Date('2026-03-10'),
        endorsements: [],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE004',
        firstName: 'Jennifer',
        lastName: 'McDonald',
        email: 'jmcdonald@icemitigation.ca',
        phone: '(416) 555-0104',
        licenseNumber: 'M789123456789',
        licenseClass: 'DZ',
        licenseExpiry: new Date('2024-12-05'),
        endorsements: ['Air Brakes', 'School Bus'],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE005',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'rwilson@icemitigation.ca',
        phone: '(416) 555-0105',
        licenseNumber: 'W321654987321',
        licenseClass: 'G',
        licenseExpiry: new Date('2025-06-18'),
        endorsements: [],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE006',
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'landerson@icemitigation.ca',
        phone: '(416) 555-0106',
        licenseNumber: 'A654987321654',
        licenseClass: 'AZ',
        licenseExpiry: new Date('2025-09-30'),
        endorsements: ['Air Brakes', 'Dangerous Goods', 'Crane Operator'],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE007',
        firstName: 'James',
        lastName: 'Taylor',
        email: 'jtaylor@icemitigation.ca',
        phone: '(416) 555-0107',
        licenseNumber: 'T987321654987',
        licenseClass: 'G',
        licenseExpiry: new Date('2024-07-12'),
        endorsements: [],
        status: 'ON_LEAVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE008',
        firstName: 'Amanda',
        lastName: 'Brown',
        email: 'abrown@icemitigation.ca',
        phone: '(416) 555-0108',
        licenseNumber: 'B147258369147',
        licenseClass: 'DZ',
        licenseExpiry: new Date('2026-01-25'),
        endorsements: ['Air Brakes'],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE009',
        firstName: 'Kevin',
        lastName: 'Martin',
        email: 'kmartin@icemitigation.ca',
        phone: '(416) 555-0109',
        licenseNumber: 'M258369147258',
        licenseClass: 'G',
        licenseExpiry: new Date('2025-04-08'),
        endorsements: [],
        status: 'ACTIVE',
        province: 'ON'
      }
    }),
    prisma.driver.create({
      data: {
        employeeId: 'ICE010',
        firstName: 'Nicole',
        lastName: 'White',
        email: 'nwhite@icemitigation.ca',
        phone: '(416) 555-0110',
        licenseNumber: 'W369147258369',
        licenseClass: 'DZ',
        licenseExpiry: new Date('2025-12-14'),
        endorsements: ['Air Brakes', 'Forklift'],
        status: 'ACTIVE',
        province: 'ON'
      }
    })
  ]);

  // 4. Seed Assignments - Restoration job assignments
  console.log('📋 Seeding assignments...');
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        jobNumber: 'ICE-2024-001',
        description: 'Water damage restoration - Office complex flooding',
        location: '123 Bay Street, Toronto, ON',
        startDate: new Date('2024-09-15T08:00:00'),
        endDate: new Date('2024-09-17T17:00:00'),
        status: 'IN_PROGRESS',
        vehicleId: vehicles[0].id,
        trailerId: trailers[0].id,
        leadDriverId: drivers[0].id,
        priority: 'HIGH',
        estimatedHours: 24
      }
    }),
    prisma.assignment.create({
      data: {
        jobNumber: 'ICE-2024-002',
        description: 'Fire damage assessment and cleanup',
        location: '456 Queen Street West, Toronto, ON',
        startDate: new Date('2024-09-18T07:00:00'),
        endDate: new Date('2024-09-20T18:00:00'),
        status: 'SCHEDULED',
        vehicleId: vehicles[1].id,
        trailerId: trailers[1].id,
        leadDriverId: drivers[1].id,
        priority: 'CRITICAL',
        estimatedHours: 36
      }
    }),
    prisma.assignment.create({
      data: {
        jobNumber: 'ICE-2024-003',
        description: 'Mold remediation - Residential basement',
        location: '789 Yonge Street, North York, ON',
        startDate: new Date('2024-09-16T09:00:00'),
        endDate: new Date('2024-09-18T16:00:00'),
        status: 'COMPLETED',
        vehicleId: vehicles[2].id,
        trailerId: trailers[2].id,
        leadDriverId: drivers[2].id,
        priority: 'MEDIUM',
        estimatedHours: 20
      }
    }),
    prisma.assignment.create({
      data: {
        jobNumber: 'ICE-2024-004',
        description: 'Emergency board-up services',
        location: '321 Bloor Street East, Toronto, ON',
        startDate: new Date('2024-09-19T06:00:00'),
        status: 'SCHEDULED',
        vehicleId: vehicles[4].id,
        trailerId: trailers[3].id,
        leadDriverId: drivers[3].id,
        priority: 'HIGH',
        estimatedHours: 8
      }
    }),
    prisma.assignment.create({
      data: {
        jobNumber: 'ICE-2024-005',
        description: 'Contents pack-out and storage',
        location: '654 King Street West, Toronto, ON',
        startDate: new Date('2024-09-21T08:00:00'),
        endDate: new Date('2024-09-22T17:00:00'),
        status: 'SCHEDULED',
        vehicleId: vehicles[5].id,
        leadDriverId: drivers[4].id,
        priority: 'MEDIUM',
        estimatedHours: 16
      }
    }),
    prisma.assignment.create({
      data: {
        jobNumber: 'ICE-2024-006',
        description: 'Structural drying - Commercial kitchen',
        location: '987 Dundas Street West, Toronto, ON',
        startDate: new Date('2024-09-14T07:00:00'),
        endDate: new Date('2024-09-16T19:00:00'),
        status: 'COMPLETED',
        vehicleId: vehicles[6].id,
        trailerId: trailers[4].id,
        leadDriverId: drivers[5].id,
        priority: 'HIGH',
        estimatedHours: 28
      }
    })
  ]);

  // 5. Add crew members to assignments
  console.log('👷 Seeding crew assignments...');
  await Promise.all([
    // Assignment 1 crew
    prisma.crewMember.create({
      data: {
        assignmentId: assignments[0].id,
        driverId: drivers[2].id,
        role: 'CREW'
      }
    }),
    prisma.crewMember.create({
      data: {
        assignmentId: assignments[0].id,
        driverId: drivers[4].id,
        role: 'CREW'
      }
    }),
    // Assignment 2 crew
    prisma.crewMember.create({
      data: {
        assignmentId: assignments[1].id,
        driverId: drivers[5].id,
        role: 'SPECIALIST'
      }
    }),
    // Assignment 3 crew
    prisma.crewMember.create({
      data: {
        assignmentId: assignments[2].id,
        driverId: drivers[8].id,
        role: 'CREW'
      }
    }),
    // Assignment 4 crew
    prisma.crewMember.create({
      data: {
        assignmentId: assignments[3].id,
        driverId: drivers[7].id,
        role: 'CREW'
      }
    }),
    // Assignment 6 crew
    prisma.crewMember.create({
      data: {
        assignmentId: assignments[5].id,
        driverId: drivers[9].id,
        role: 'CREW'
      }
    })
  ]);

  // 6. Seed Compliance Documents
  console.log('📑 Seeding compliance documents...');
  const complianceDocuments = await Promise.all([
    // Vehicle Insurance Documents
    ...vehicles.slice(0, 6).map((vehicle, index) => 
      prisma.complianceDocument.create({
        data: {
          type: 'INSURANCE',
          documentNumber: `INS-ON-2024-${String(index + 1).padStart(3, '0')}`,
          issueDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-01-01'),
          status: 'VALID',
          vehicleId: vehicle.id,
          notes: 'Commercial fleet insurance policy'
        }
      })
    ),
    
    // Vehicle Registration Documents
    ...vehicles.slice(0, 6).map((vehicle, index) => 
      prisma.complianceDocument.create({
        data: {
          type: 'REGISTRATION',
          documentNumber: `REG-ON-${vehicle.licensePlate}`,
          issueDate: new Date('2024-03-01'),
          expiryDate: new Date(index < 2 ? '2024-10-15' : '2025-03-01'), // First 2 expiring soon
          status: index < 2 ? 'EXPIRING_SOON' : 'VALID',
          vehicleId: vehicle.id,
          notes: 'Ontario vehicle registration'
        }
      })
    ),

    // Vehicle Inspection Documents
    ...vehicles.slice(0, 4).map((vehicle, index) => 
      prisma.complianceDocument.create({
        data: {
          type: 'INSPECTION',
          documentNumber: `INSP-${vehicle.vin.slice(-6)}`,
          issueDate: new Date('2024-06-01'),
          expiryDate: new Date(index === 0 ? '2024-09-10' : '2025-06-01'), // First one expired
          status: index === 0 ? 'EXPIRED' : 'VALID',
          vehicleId: vehicle.id,
          notes: 'Annual safety inspection'
        }
      })
    ),

    // Trailer Documents
    ...trailers.slice(0, 4).map((trailer, index) => 
      prisma.complianceDocument.create({
        data: {
          type: 'REGISTRATION',
          documentNumber: `TRL-REG-${trailer.licensePlate}`,
          issueDate: new Date('2024-02-01'),
          expiryDate: new Date(index === 1 ? '2024-09-25' : '2025-02-01'), // Second one expiring soon
          status: index === 1 ? 'EXPIRING_SOON' : 'VALID',
          trailerId: trailer.id,
          notes: 'Trailer registration certificate'
        }
      })
    ),

    // Commercial Permits
    prisma.complianceDocument.create({
      data: {
        type: 'COMMERCIAL_PERMIT',
        documentNumber: 'CVOR-ICE-2024',
        issueDate: new Date('2024-01-15'),
        expiryDate: new Date('2026-01-15'),
        status: 'VALID',
        vehicleId: vehicles[0].id,
        notes: 'Commercial Vehicle Operator Registration'
      }
    })
  ]);

  // 7. Seed Maintenance Records
  console.log('🔧 Seeding maintenance records...');
  const maintenanceRecords = await Promise.all([
    // Completed maintenance
    prisma.maintenanceRecord.create({
      data: {
        type: 'PREVENTIVE',
        description: 'Oil change and filter replacement',
        scheduledDate: new Date('2024-08-15'),
        completedDate: new Date('2024-08-15'),
        odometer: 14500,
        cost: 125.50,
        status: 'COMPLETED',
        vehicleId: vehicles[0].id,
        serviceProvider: 'Toronto Fleet Services',
        workOrderNumber: 'WO-2024-001',
        notes: 'Standard 10,000km service completed'
      }
    }),
    
    prisma.maintenanceRecord.create({
      data: {
        type: 'CORRECTIVE',
        description: 'Brake pad replacement',
        scheduledDate: new Date('2024-09-01'),
        completedDate: new Date('2024-09-02'),
        odometer: 27800,
        cost: 485.75,
        status: 'COMPLETED',
        vehicleId: vehicles[1].id,
        serviceProvider: 'Heavy Duty Repair Inc',
        workOrderNumber: 'WO-2024-002',
        notes: 'Front brake pads worn, replaced with OEM parts'
      }
    }),

    // Scheduled maintenance
    prisma.maintenanceRecord.create({
      data: {
        type: 'PREVENTIVE',
        description: 'Transmission service',
        scheduledDate: new Date('2024-09-25'),
        status: 'SCHEDULED',
        vehicleId: vehicles[2].id,
        serviceProvider: 'Central Transmission',
        workOrderNumber: 'WO-2024-003',
        notes: 'Due at 45,000km interval'
      }
    }),

    prisma.maintenanceRecord.create({
      data: {
        type: 'INSPECTION',
        description: 'Annual safety inspection',
        scheduledDate: new Date('2024-09-20'),
        status: 'SCHEDULED',
        vehicleId: vehicles[4].id,
        serviceProvider: 'Ontario Safety Centre',
        workOrderNumber: 'WO-2024-004'
      }
    }),

    // Overdue maintenance
    prisma.maintenanceRecord.create({
      data: {
        type: 'PREVENTIVE',
        description: 'Oil change - OVERDUE',
        scheduledDate: new Date('2024-08-20'),
        status: 'OVERDUE',
        vehicleId: vehicles[3].id,
        serviceProvider: 'Quick Lube Express',
        workOrderNumber: 'WO-2024-005',
        notes: 'Vehicle in maintenance status, service delayed'
      }
    }),

    // In progress maintenance
    prisma.maintenanceRecord.create({
      data: {
        type: 'CORRECTIVE',
        description: 'Engine diagnostic and repair',
        scheduledDate: new Date('2024-09-10'),
        status: 'IN_PROGRESS',
        vehicleId: vehicles[3].id,
        serviceProvider: 'Diesel Solutions Pro',
        workOrderNumber: 'WO-2024-006',
        notes: 'Check engine light, requires diagnostic scan'
      }
    }),

    // Trailer maintenance
    prisma.maintenanceRecord.create({
      data: {
        type: 'PREVENTIVE',
        description: 'Trailer tire rotation and inspection',
        scheduledDate: new Date('2024-09-18'),
        completedDate: new Date('2024-09-18'),
        cost: 180.00,
        status: 'COMPLETED',
        trailerId: trailers[0].id,
        serviceProvider: 'Trailer Pro Services',
        workOrderNumber: 'WO-2024-007'
      }
    }),

    prisma.maintenanceRecord.create({
      data: {
        type: 'CORRECTIVE',
        description: 'Trailer brake adjustment',
        scheduledDate: new Date('2024-09-22'),
        status: 'SCHEDULED',
        trailerId: trailers[4].id,
        serviceProvider: 'Trailer Pro Services',
        workOrderNumber: 'WO-2024-008',
        notes: 'Brake adjustment required after inspection'
      }
    })
  ]);

  // 8. Seed some form submissions
  console.log('📝 Seeding form submissions...');
  await Promise.all([
    prisma.formSubmission.create({
      data: {
        formType: 'contact',
        name: 'John Customer',
        email: 'john.customer@example.com',
        subject: 'Service Inquiry',
        message: 'Interested in your emergency restoration services for our office building.',
        status: 'new'
      }
    }),
    prisma.formSubmission.create({
      data: {
        formType: 'contact',
        name: 'Sarah Property Manager',
        email: 'sarah.pm@propertygroup.ca',
        subject: 'Fleet Services Question',
        message: 'Do you provide 24/7 emergency response services in the GTA?',
        status: 'responded'
      }
    })
  ]);

  console.log('✅ Seeding completed successfully!');
  console.log(`
📊 Database seeded with:
- ${vehicles.length} vehicles
- ${trailers.length} trailers  
- ${drivers.length} drivers
- ${assignments.length} assignments
- ${complianceDocuments.length} compliance documents
- ${maintenanceRecords.length} maintenance records
- 2 form submissions

🏢 ICE Mitigation Services fleet is ready for operations!
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
