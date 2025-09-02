export enum CompatibilityStatus {
  PASS = 'PASS',
  WARNING = 'WARNING',
  FAIL = 'FAIL'
}

export interface Vehicle {
  id: string
  towingCapacityKg: number
  hitchClass: number
  hasElectricBrakeController?: boolean
  make: string
  model: string
  year: number
}

export interface Trailer {
  id: string
  requiredTowingCapacityKg: number
  requiredHitchClass: number
  type: string
  hasElectricBrakes: boolean
  requiresElectricBrakeController?: boolean
}

export interface CompatibilityResult {
  vehicleId: string
  trailerId: string
  status: CompatibilityStatus
  canTow: boolean
  capacityMarginKg: number
  capacityUtilizationPercent?: number
  issues: string[]
  warnings: string[]
  recommendations: string[]
}

export interface VehicleMatch {
  vehicle: Vehicle
  compatibility: CompatibilityResult
  matchScore: number
  capacityUtilization: number
}

const SAFETY_MARGIN_KG = 200 // 200kg safety buffer
const IDEAL_UTILIZATION_RANGE = { min: 0.5, max: 0.85 } // 50-85% utilization is ideal

export function checkVehicleTrailerCompatibility(
  vehicle: Vehicle,
  trailer: Trailer
): CompatibilityResult {
  const issues: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []
  
  // Calculate capacity margin
  const capacityMarginKg = vehicle.towingCapacityKg - trailer.requiredTowingCapacityKg
  const capacityUtilizationPercent = (trailer.requiredTowingCapacityKg / vehicle.towingCapacityKg) * 100
  
  // Check towing capacity
  if (capacityMarginKg < 0) {
    issues.push(
      `Insufficient towing capacity: vehicle has ${vehicle.towingCapacityKg}kg, trailer requires ${trailer.requiredTowingCapacityKg}kg`
    )
    recommendations.push(`Upgrade to a vehicle with at least ${trailer.requiredTowingCapacityKg + SAFETY_MARGIN_KG}kg towing capacity`)
  } else if (capacityMarginKg < SAFETY_MARGIN_KG) {
    warnings.push(
      `Low capacity margin (${capacityMarginKg}kg) - consider using a vehicle with more towing capacity for safety`
    )
    recommendations.push('Consider a vehicle with 20% more towing capacity for safer operation')
  }
  
  // Check hitch class compatibility
  if (vehicle.hitchClass < trailer.requiredHitchClass) {
    issues.push(
      `Incompatible hitch class: vehicle has Class ${vehicle.hitchClass}, trailer requires Class ${trailer.requiredHitchClass}`
    )
    recommendations.push(`Vehicle needs a Class ${trailer.requiredHitchClass} or higher hitch`)
  }
  
  // Check electric brake controller
  if (trailer.requiresElectricBrakeController && !vehicle.hasElectricBrakeController) {
    issues.push('Trailer requires electric brake controller which vehicle does not have')
    recommendations.push('Install electric brake controller or select different vehicle')
  }
  
  // Check for over-utilization
  if (capacityUtilizationPercent > 95) {
    warnings.push('Operating at >95% of towing capacity - not recommended for regular use')
  }
  
  // Determine status
  let status: CompatibilityStatus
  let canTow: boolean
  
  if (issues.length > 0) {
    status = CompatibilityStatus.FAIL
    canTow = false
  } else if (warnings.length > 0) {
    status = CompatibilityStatus.WARNING
    canTow = true
  } else {
    status = CompatibilityStatus.PASS
    canTow = true
  }
  
  return {
    vehicleId: vehicle.id,
    trailerId: trailer.id,
    status,
    canTow,
    capacityMarginKg,
    capacityUtilizationPercent,
    issues,
    warnings,
    recommendations
  }
}

export function getCompatibilityRecommendations(result: CompatibilityResult): string[] {
  const recommendations = [...result.recommendations]
  
  if (result.status === CompatibilityStatus.FAIL) {
    if (result.capacityMarginKg < 0) {
      recommendations.push(`Upgrade to a vehicle with at least ${Math.abs(result.capacityMarginKg) + SAFETY_MARGIN_KG}kg more towing capacity`)
      recommendations.push('Consider lighter trailer alternatives')
    }
  }
  
  if (result.capacityUtilizationPercent && result.capacityUtilizationPercent < IDEAL_UTILIZATION_RANGE.min * 100) {
    recommendations.push('Vehicle is over-specified for this trailer - consider using for heavier loads')
  }
  
  return recommendations
}

export function findBestVehicleMatches(
  vehicles: Vehicle[],
  trailer: Trailer,
  maxResults: number = 5
): VehicleMatch[] {
  const matches: VehicleMatch[] = []
  
  for (const vehicle of vehicles) {
    const compatibility = checkVehicleTrailerCompatibility(vehicle, trailer)
    
    if (compatibility.canTow) {
      const capacityUtilization = trailer.requiredTowingCapacityKg / vehicle.towingCapacityKg
      
      // Calculate match score (0-1)
      let matchScore = 0
      
      // Capacity utilization score (ideal is 50-85%)
      if (capacityUtilization >= IDEAL_UTILIZATION_RANGE.min && capacityUtilization <= IDEAL_UTILIZATION_RANGE.max) {
        matchScore += 0.5
      } else if (capacityUtilization < IDEAL_UTILIZATION_RANGE.min) {
        matchScore += 0.3 // Over-specified
      } else {
        matchScore += 0.4 // High utilization but acceptable
      }
      
      // Status score
      if (compatibility.status === CompatibilityStatus.PASS) {
        matchScore += 0.3
      } else if (compatibility.status === CompatibilityStatus.WARNING) {
        matchScore += 0.1
      }
      
      // Hitch class exact match bonus
      if (vehicle.hitchClass === trailer.requiredHitchClass) {
        matchScore += 0.2
      } else if (vehicle.hitchClass > trailer.requiredHitchClass) {
        matchScore += 0.1
      }
      
      matches.push({
        vehicle,
        compatibility,
        matchScore,
        capacityUtilization
      })
    }
  }
  
  // Sort by match score (best first)
  matches.sort((a, b) => {
    // First by match score
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore
    }
    // Then by optimal utilization
    const aUtilDiff = Math.abs(a.capacityUtilization - 0.7) // 70% is ideal
    const bUtilDiff = Math.abs(b.capacityUtilization - 0.7)
    return aUtilDiff - bUtilDiff
  })
  
  return matches.slice(0, maxResults)
}

// Helper function to format compatibility for display
export function formatCompatibilityDisplay(result: CompatibilityResult): {
  icon: string
  color: string
  title: string
  subtitle: string
} {
  const displays = {
    [CompatibilityStatus.PASS]: {
      icon: '✓',
      color: 'green',
      title: 'Compatible',
      subtitle: `${result.capacityMarginKg}kg margin available`
    },
    [CompatibilityStatus.WARNING]: {
      icon: '⚠',
      color: 'amber',
      title: 'Compatible with Warnings',
      subtitle: result.warnings[0] || 'Check warnings before proceeding'
    },
    [CompatibilityStatus.FAIL]: {
      icon: '✗',
      color: 'red',
      title: 'Not Compatible',
      subtitle: result.issues[0] || 'Cannot safely tow this trailer'
    }
  }
  
  return displays[result.status]
}

// Provincial requirements checker (Canadian context)
export function checkProvincialRequirements(
  vehicle: Vehicle,
  trailer: Trailer,
  province: string
): string[] {
  const requirements: string[] = []
  
  // Ontario specific requirements
  if (province === 'ON') {
    if (trailer.requiredTowingCapacityKg > 4600) {
      requirements.push('Ontario: Trailer over 4,600kg requires commercial plates')
    }
    if (trailer.hasElectricBrakes) {
      requirements.push('Ontario: Electric brakes required for trailers over 1,360kg')
    }
  }
  
  // Quebec specific requirements
  if (province === 'QC') {
    if (trailer.requiredTowingCapacityKg > 900) {
      requirements.push('Quebec: Safety chains required for trailers over 900kg')
    }
  }
  
  // Alberta specific requirements
  if (province === 'AB') {
    if (trailer.requiredTowingCapacityKg > 2000) {
      requirements.push('Alberta: Breakaway brakes required for trailers over 2,000kg')
    }
  }
  
  return requirements
}