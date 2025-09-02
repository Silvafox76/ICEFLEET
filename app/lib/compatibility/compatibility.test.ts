import { 
  checkVehicleTrailerCompatibility,
  CompatibilityResult,
  CompatibilityStatus,
  getCompatibilityRecommendations,
  findBestVehicleMatches
} from './compatibility'

describe('Vehicle-Trailer Compatibility Explorer', () => {
  describe('checkVehicleTrailerCompatibility', () => {
    it('should pass when vehicle capacity exceeds trailer requirements', () => {
      const vehicle = {
        id: 'v1',
        towingCapacityKg: 3500,
        hitchClass: 3,
        make: 'Ford',
        model: 'F-150',
        year: 2023
      }
      
      const trailer = {
        id: 't1',
        requiredTowingCapacityKg: 2000,
        requiredHitchClass: 3,
        type: 'Enclosed',
        hasElectricBrakes: false
      }
      
      const result = checkVehicleTrailerCompatibility(vehicle, trailer)
      
      expect(result.status).toBe(CompatibilityStatus.PASS)
      expect(result.canTow).toBe(true)
      expect(result.capacityMarginKg).toBe(1500)
      expect(result.issues).toHaveLength(0)
    })
    
    it('should fail when vehicle capacity is insufficient', () => {
      const vehicle = {
        id: 'v2',
        towingCapacityKg: 1500,
        hitchClass: 2,
        make: 'Honda',
        model: 'CR-V',
        year: 2023
      }
      
      const trailer = {
        id: 't2',
        requiredTowingCapacityKg: 3500,
        requiredHitchClass: 3,
        type: 'Flatbed',
        hasElectricBrakes: true
      }
      
      const result = checkVehicleTrailerCompatibility(vehicle, trailer)
      
      expect(result.status).toBe(CompatibilityStatus.FAIL)
      expect(result.canTow).toBe(false)
      expect(result.issues).toContain('Insufficient towing capacity: vehicle has 1500kg, trailer requires 3500kg')
      expect(result.issues).toContain('Incompatible hitch class: vehicle has Class 2, trailer requires Class 3')
    })
    
    it('should warn when capacity margin is below safety threshold', () => {
      const vehicle = {
        id: 'v3',
        towingCapacityKg: 2100,
        hitchClass: 3,
        make: 'Chevrolet',
        model: 'Silverado',
        year: 2023
      }
      
      const trailer = {
        id: 't3',
        requiredTowingCapacityKg: 2000,
        requiredHitchClass: 3,
        type: 'Utility',
        hasElectricBrakes: false
      }
      
      const result = checkVehicleTrailerCompatibility(vehicle, trailer)
      
      expect(result.status).toBe(CompatibilityStatus.WARNING)
      expect(result.canTow).toBe(true)
      expect(result.warnings).toContain('Low capacity margin (100kg) - consider using a vehicle with more towing capacity for safety')
    })
    
    it('should check electric brake requirements', () => {
      const vehicle = {
        id: 'v4',
        towingCapacityKg: 5000,
        hitchClass: 4,
        hasElectricBrakeController: false,
        make: 'RAM',
        model: '2500',
        year: 2023
      }
      
      const trailer = {
        id: 't4',
        requiredTowingCapacityKg: 3500,
        requiredHitchClass: 4,
        type: 'Equipment',
        hasElectricBrakes: true,
        requiresElectricBrakeController: true
      }
      
      const result = checkVehicleTrailerCompatibility(vehicle, trailer)
      
      expect(result.status).toBe(CompatibilityStatus.FAIL)
      expect(result.issues).toContain('Trailer requires electric brake controller which vehicle does not have')
    })
  })
  
  describe('getCompatibilityRecommendations', () => {
    it('should provide recommendations for failed compatibility', () => {
      const result = {
        vehicleId: 'v1',
        trailerId: 't1',
        status: CompatibilityStatus.FAIL,
        canTow: false,
        capacityMarginKg: -1500,
        issues: ['Insufficient towing capacity'],
        warnings: [],
        recommendations: []
      }
      
      const recommendations = getCompatibilityRecommendations(result)
      
      expect(recommendations).toContain('Upgrade to a vehicle with at least 3500kg towing capacity')
      expect(recommendations).toContain('Consider lighter trailer alternatives')
    })
  })
  
  describe('findBestVehicleMatches', () => {
    it('should find compatible vehicles for a trailer sorted by best match', () => {
      const vehicles = [
        { id: 'v1', towingCapacityKg: 1000, hitchClass: 2, make: 'Honda', model: 'Pilot', year: 2023 },
        { id: 'v2', towingCapacityKg: 3500, hitchClass: 3, make: 'Ford', model: 'F-150', year: 2023 },
        { id: 'v3', towingCapacityKg: 5000, hitchClass: 4, make: 'RAM', model: '2500', year: 2023 },
        { id: 'v4', towingCapacityKg: 2500, hitchClass: 3, make: 'Chevrolet', model: 'Colorado', year: 2023 }
      ]
      
      const trailer = {
        id: 't1',
        requiredTowingCapacityKg: 2000,
        requiredHitchClass: 3,
        type: 'Enclosed',
        hasElectricBrakes: false
      }
      
      const matches = findBestVehicleMatches(vehicles, trailer)
      
      expect(matches).toHaveLength(3) // Excludes Honda Pilot
      expect(matches[0].vehicle.id).toBe('v4') // Best match with adequate margin
      expect(matches[0].matchScore).toBeGreaterThan(0.8)
      expect(matches[0].capacityUtilization).toBe(0.8) // 2000/2500
    })
  })
})