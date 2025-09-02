'use client'

import { useEffect, useState } from 'react'
import { CompatibilityExplorer } from '@/components/compatibility/CompatibilityExplorer'
import type { Vehicle, Trailer } from '@/lib/compatibility/compatibility'

export default function CompatibilityPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trailers, setTrailers] = useState<Trailer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, trailersRes] = await Promise.all([
          fetch('/api/fleet'),
          fetch('/api/fleet?type=trailer')
        ])

        const vehiclesData = await vehiclesRes.json()
        const trailersData = await trailersRes.json()

        // Transform the data to match our compatibility types
        const vehiclesList = vehiclesData.vehicles?.map((v: any) => ({
          id: v.id,
          towingCapacityKg: v.towingCapacityKg || 0,
          hitchClass: v.hitchClass || 0,
          hasElectricBrakeController: v.hasElectricBrakeController || false,
          make: v.make,
          model: v.model,
          year: v.year
        })) || []

        const trailersList = trailersData.trailers?.map((t: any) => ({
          id: t.id,
          requiredTowingCapacityKg: t.requiredTowingCapacityKg || 0,
          requiredHitchClass: t.requiredHitchClass || 0,
          type: t.type,
          hasElectricBrakes: t.hasElectricBrakes || false,
          requiresElectricBrakeController: t.requiresElectricBrakeController || false
        })) || []

        setVehicles(vehiclesList)
        setTrailers(trailersList)
      } catch (error) {
        console.error('Failed to fetch fleet data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveCompatibility = async (result: any) => {
    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      })
      
      if (response.ok) {
        // Show success message
        console.log('Compatibility check saved')
      }
    } catch (error) {
      console.error('Failed to save compatibility:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading fleet data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Compatibility Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Ensure safe vehicle-trailer pairing with our intelligent compatibility checker
        </p>
      </div>
      
      <CompatibilityExplorer
        vehicles={vehicles}
        trailers={trailers}
        onSaveCompatibility={handleSaveCompatibility}
        defaultProvince="ON"
      />
    </div>
  )
}