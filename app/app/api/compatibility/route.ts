import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { 
  checkVehicleTrailerCompatibility,
  findBestVehicleMatches,
  checkProvincialRequirements
} from '@/lib/compatibility/compatibility'

const prisma = new PrismaClient()

// GET /api/compatibility - Check vehicle-trailer compatibility
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const trailerId = searchParams.get('trailerId')
    const province = searchParams.get('province') || 'ON'

    if (!vehicleId || !trailerId) {
      return NextResponse.json(
        { error: 'vehicleId and trailerId are required' },
        { status: 400 }
      )
    }

    // Fetch vehicle and trailer from database
    const [vehicle, trailer] = await Promise.all([
      prisma.vehicle.findUnique({
        where: { id: vehicleId }
      }),
      prisma.trailer.findUnique({
        where: { id: trailerId }
      })
    ])

    if (!vehicle || !trailer) {
      return NextResponse.json(
        { error: 'Vehicle or trailer not found' },
        { status: 404 }
      )
    }

    // Convert database models to compatibility types
    const vehicleData = {
      id: vehicle.id,
      towingCapacityKg: vehicle.towingCapacityKg || 0,
      hitchClass: vehicle.hitchClass || 0,
      hasElectricBrakeController: vehicle.hasElectricBrakeController || false,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year
    }

    const trailerData = {
      id: trailer.id,
      requiredTowingCapacityKg: trailer.requiredTowingCapacityKg || 0,
      requiredHitchClass: trailer.requiredHitchClass || 0,
      type: trailer.type,
      hasElectricBrakes: trailer.hasElectricBrakes || false,
      requiresElectricBrakeController: trailer.requiresElectricBrakeController || false
    }

    // Check compatibility
    const compatibilityResult = checkVehicleTrailerCompatibility(vehicleData, trailerData)
    const provincialRequirements = checkProvincialRequirements(vehicleData, trailerData, province)

    // Save compatibility check to database
    await prisma.compatibilityCheck.create({
      data: {
        vehicleId,
        trailerId,
        status: compatibilityResult.status,
        canTow: compatibilityResult.canTow,
        capacityMarginKg: compatibilityResult.capacityMarginKg,
        issues: compatibilityResult.issues,
        warnings: compatibilityResult.warnings,
        recommendations: compatibilityResult.recommendations,
        province,
        checkedAt: new Date()
      }
    })

    return NextResponse.json({
      compatibility: compatibilityResult,
      provincialRequirements,
      vehicle: {
        id: vehicle.id,
        name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        towingCapacityKg: vehicle.towingCapacityKg,
        hitchClass: vehicle.hitchClass
      },
      trailer: {
        id: trailer.id,
        type: trailer.type,
        requiredTowingCapacityKg: trailer.requiredTowingCapacityKg,
        requiredHitchClass: trailer.requiredHitchClass
      }
    })
  } catch (error) {
    console.error('Error checking compatibility:', error)
    return NextResponse.json(
      { error: 'Failed to check compatibility' },
      { status: 500 }
    )
  }
}

// POST /api/compatibility/best-matches - Find best vehicle matches for a trailer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trailerId, maxResults = 5 } = body

    if (!trailerId) {
      return NextResponse.json(
        { error: 'trailerId is required' },
        { status: 400 }
      )
    }

    // Fetch trailer and all active vehicles
    const [trailer, vehicles] = await Promise.all([
      prisma.trailer.findUnique({
        where: { id: trailerId }
      }),
      prisma.vehicle.findMany({
        where: { 
          status: 'ACTIVE',
          towingCapacityKg: { not: null }
        },
        orderBy: { towingCapacityKg: 'desc' }
      })
    ])

    if (!trailer) {
      return NextResponse.json(
        { error: 'Trailer not found' },
        { status: 404 }
      )
    }

    // Convert to compatibility types
    const trailerData = {
      id: trailer.id,
      requiredTowingCapacityKg: trailer.requiredTowingCapacityKg || 0,
      requiredHitchClass: trailer.requiredHitchClass || 0,
      type: trailer.type,
      hasElectricBrakes: trailer.hasElectricBrakes || false,
      requiresElectricBrakeController: trailer.requiresElectricBrakeController || false
    }

    const vehiclesData = vehicles.map((v: any) => ({
      id: v.id,
      towingCapacityKg: v.towingCapacityKg || 0,
      hitchClass: v.hitchClass || 0,
      hasElectricBrakeController: v.hasElectricBrakeController || false,
      make: v.make,
      model: v.model,
      year: v.year
    }))

    // Find best matches
    const matches = findBestVehicleMatches(vehiclesData, trailerData, maxResults)

    return NextResponse.json({
      trailer: {
        id: trailer.id,
        type: trailer.type,
        requiredTowingCapacityKg: trailer.requiredTowingCapacityKg,
        requiredHitchClass: trailer.requiredHitchClass
      },
      matches: matches.map(match => ({
        vehicle: {
          id: match.vehicle.id,
          name: `${match.vehicle.year} ${match.vehicle.make} ${match.vehicle.model}`,
          towingCapacityKg: match.vehicle.towingCapacityKg,
          hitchClass: match.vehicle.hitchClass
        },
        matchScore: match.matchScore,
        capacityUtilization: match.capacityUtilization,
        status: match.compatibility.status,
        canTow: match.compatibility.canTow
      })),
      totalCompatibleVehicles: matches.length
    })
  } catch (error) {
    console.error('Error finding best matches:', error)
    return NextResponse.json(
      { error: 'Failed to find best matches' },
      { status: 500 }
    )
  }
}

// GET /api/compatibility/history - Get compatibility check history
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const trailerId = searchParams.get('trailerId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    if (vehicleId) where.vehicleId = vehicleId
    if (trailerId) where.trailerId = trailerId

    const history = await prisma.compatibilityCheck.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true
          }
        },
        trailer: {
          select: {
            id: true,
            type: true
          }
        }
      },
      orderBy: { checkedAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      history: history.map((check: any) => ({
        id: check.id,
        vehicle: `${check.vehicle.year} ${check.vehicle.make} ${check.vehicle.model}`,
        trailer: check.trailer.type,
        status: check.status,
        canTow: check.canTow,
        checkedAt: check.checkedAt,
        province: check.province
      })),
      total: history.length
    })
  } catch (error) {
    console.error('Error fetching compatibility history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch compatibility history' },
      { status: 500 }
    )
  }
}