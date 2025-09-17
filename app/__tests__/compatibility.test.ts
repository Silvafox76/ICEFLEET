import { 
  checkVehicleTrailerCompatibility,
  findBestVehicleMatches,
  checkProvincialRequirements,
  type Vehicle,
  type Trailer,
  type CompatibilityResult
} from '@/lib/compatibility/compatibility';

describe('Vehicle-Trailer Compatibility', () => {
  const mockVehicle: Vehicle = {
    id: '1',
    towingCapacityKg: 3500,
    hitchClass: 3,
    hasElectricBrakeController: true,
    make: 'Ford',
    model: 'F-150',
    year: 2023
  };

  const mockTrailer: Trailer = {
    id: '1',
    requiredTowingCapacityKg: 3000,
    requiredHitchClass: 3,
    type: 'Utility',
    hasElectricBrakes: true,
    requiresElectricBrakeController: true
  };

  describe('checkVehicleTrailerCompatibility', () => {
    it('should return compatible for matching specifications', () => {
      const result = checkVehicleTrailerCompatibility(mockVehicle, mockTrailer, 'ON');
      
      expect(result.isCompatible).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should return incompatible for insufficient towing capacity', () => {
      const heavyTrailer: Trailer = {
        ...mockTrailer,
        requiredTowingCapacityKg: 5000
      };

      const result = checkVehicleTrailerCompatibility(mockVehicle, heavyTrailer, 'ON');
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('Insufficient towing capacity');
    });

    it('should return incompatible for wrong hitch class', () => {
      const wrongHitchTrailer: Trailer = {
        ...mockTrailer,
        requiredHitchClass: 5
      };

      const result = checkVehicleTrailerCompatibility(mockVehicle, wrongHitchTrailer, 'ON');
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('Incompatible hitch class');
    });

    it('should return warning for missing brake controller', () => {
      const vehicleWithoutController: Vehicle = {
        ...mockVehicle,
        hasElectricBrakeController: false
      };

      const result = checkVehicleTrailerCompatibility(vehicleWithoutController, mockTrailer, 'ON');
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('Electric brake controller required');
    });

    it('should handle provincial requirements', () => {
      const result = checkVehicleTrailerCompatibility(mockVehicle, mockTrailer, 'BC');
      
      expect(result.provincialRequirements).toBeDefined();
      expect(result.provincialRequirements.province).toBe('BC');
    });
  });

  describe('findBestVehicleMatches', () => {
    const vehicles: Vehicle[] = [
      mockVehicle,
      {
        id: '2',
        towingCapacityKg: 2000,
        hitchClass: 2,
        hasElectricBrakeController: false,
        make: 'Chevrolet',
        model: 'Silverado',
        year: 2022
      },
      {
        id: '3',
        towingCapacityKg: 5000,
        hitchClass: 4,
        hasElectricBrakeController: true,
        make: 'Ram',
        model: '2500',
        year: 2023
      }
    ];

    it('should return vehicles sorted by compatibility score', () => {
      const matches = findBestVehicleMatches(vehicles, mockTrailer, 'ON');
      
      expect(matches).toHaveLength(3);
      expect(matches[0].vehicle.id).toBe('1'); // Perfect match
      expect(matches[0].compatibilityScore).toBeGreaterThan(matches[1].compatibilityScore);
    });

    it('should filter out incompatible vehicles when requested', () => {
      const matches = findBestVehicleMatches(vehicles, mockTrailer, 'ON', true);
      
      expect(matches).toHaveLength(2); // Only compatible vehicles
      expect(matches.every(match => match.isCompatible)).toBe(true);
    });
  });

  describe('checkProvincialRequirements', () => {
    it('should return Ontario requirements', () => {
      const requirements = checkProvincialRequirements('ON');
      
      expect(requirements.province).toBe('ON');
      expect(requirements.requirements).toBeDefined();
      expect(requirements.requirements.length).toBeGreaterThan(0);
    });

    it('should return BC requirements', () => {
      const requirements = checkProvincialRequirements('BC');
      
      expect(requirements.province).toBe('BC');
      expect(requirements.requirements).toBeDefined();
    });

    it('should handle unknown provinces gracefully', () => {
      const requirements = checkProvincialRequirements('XX');
      
      expect(requirements.province).toBe('XX');
      expect(requirements.requirements).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero towing capacity', () => {
      const zeroCapacityVehicle: Vehicle = {
        ...mockVehicle,
        towingCapacityKg: 0
      };

      const result = checkVehicleTrailerCompatibility(zeroCapacityVehicle, mockTrailer, 'ON');
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('Insufficient towing capacity');
    });

    it('should handle missing trailer requirements', () => {
      const incompleteTrailer: Trailer = {
        id: '1',
        requiredTowingCapacityKg: 0,
        requiredHitchClass: 0,
        type: 'Unknown',
        hasElectricBrakes: false,
        requiresElectricBrakeController: false
      };

      const result = checkVehicleTrailerCompatibility(mockVehicle, incompleteTrailer, 'ON');
      
      expect(result).toBeDefined();
      expect(result.isCompatible).toBe(true); // Should be compatible with no requirements
    });

    it('should handle empty vehicle array', () => {
      const matches = findBestVehicleMatches([], mockTrailer, 'ON');
      
      expect(matches).toHaveLength(0);
    });
  });
});
