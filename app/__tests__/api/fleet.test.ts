import { NextRequest } from 'next/server';
import { GET } from '@/app/api/fleet/route';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  vehicle: {
    findMany: jest.fn(),
  },
  trailer: {
    findMany: jest.fn(),
  },
}));

// Mock mock data
jest.mock('@/lib/mock-data', () => ({
  mockVehicles: [
    {
      id: '1',
      vin: '1FTFW1ET5DFC12345',
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      licensePlate: 'ABC-123',
      towingCapacityKg: 3500,
      hitchClass: 3,
      hasElectricBrakeController: true,
      status: 'ACTIVE',
      odometer: 15000,
      fuelType: 'Gasoline',
      province: 'ON'
    }
  ],
  mockTrailers: [
    {
      id: '1',
      serialNumber: 'TRL-001',
      type: 'Utility',
      requiredTowingCapacityKg: 3000,
      requiredHitchClass: 3,
      hasElectricBrakes: true,
      requiresElectricBrakeController: true,
      status: 'ACTIVE',
      licensePlate: 'TRL-123',
      province: 'ON'
    }
  ]
}));

describe('/api/fleet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/fleet', () => {
    it('should return vehicles when no type specified', async () => {
      const mockPrisma = require('@/lib/db').default;
      mockPrisma.vehicle.findMany.mockResolvedValue([
        {
          id: '1',
          vin: '1FTFW1ET5DFC12345',
          make: 'Ford',
          model: 'F-150',
          year: 2023
        }
      ]);

      const request = new NextRequest('http://localhost:3000/api/fleet');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vehicles).toBeDefined();
      expect(data.vehicles).toHaveLength(1);
      expect(data.vehicles[0].make).toBe('Ford');
    });

    it('should return trailers when type=trailer', async () => {
      const mockPrisma = require('@/lib/db').default;
      mockPrisma.trailer.findMany.mockResolvedValue([
        {
          id: '1',
          serialNumber: 'TRL-001',
          type: 'Utility'
        }
      ]);

      const request = new NextRequest('http://localhost:3000/api/fleet?type=trailer');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.trailers).toBeDefined();
      expect(data.trailers).toHaveLength(1);
      expect(data.trailers[0].type).toBe('Utility');
    });

    it('should fallback to mock data when database fails', async () => {
      const mockPrisma = require('@/lib/db').default;
      mockPrisma.vehicle.findMany.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/fleet');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vehicles).toBeDefined();
      expect(data.vehicles).toHaveLength(1);
      expect(data.vehicles[0].make).toBe('Ford');
    });

    it('should handle general errors gracefully', async () => {
      const mockPrisma = require('@/lib/db').default;
      mockPrisma.vehicle.findMany.mockRejectedValue(new Error('Unexpected error'));

      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/api/fleet');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vehicles).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith('Fleet API error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
