'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  checkVehicleTrailerCompatibility,
  findBestVehicleMatches,
  formatCompatibilityDisplay,
  checkProvincialRequirements,
  CompatibilityStatus,
  type Vehicle,
  type Trailer,
  type CompatibilityResult,
  type VehicleMatch
} from '@/lib/compatibility/compatibility'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  Link, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  ArrowRight,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react'

interface CompatibilityExplorerProps {
  vehicles: Vehicle[]
  trailers: Trailer[]
  onSaveCompatibility?: (result: CompatibilityResult) => void
  defaultProvince?: string
}

export function CompatibilityExplorer({
  vehicles,
  trailers,
  onSaveCompatibility,
  defaultProvince = 'ON'
}: CompatibilityExplorerProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null)
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null)
  const [bestMatches, setBestMatches] = useState<VehicleMatch[]>([])
  const [province, setProvince] = useState(defaultProvince)
  const [provincialRequirements, setProvincialRequirements] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Check compatibility when selections change
  useEffect(() => {
    if (selectedVehicle && selectedTrailer) {
      setIsAnalyzing(true)
      
      // Simulate analysis delay for better UX
      setTimeout(() => {
        const result = checkVehicleTrailerCompatibility(selectedVehicle, selectedTrailer)
        setCompatibilityResult(result)
        
        const requirements = checkProvincialRequirements(selectedVehicle, selectedTrailer, province)
        setProvincialRequirements(requirements)
        
        setIsAnalyzing(false)
      }, 500)
    } else {
      setCompatibilityResult(null)
      setProvincialRequirements([])
    }
  }, [selectedVehicle, selectedTrailer, province])

  // Find best matches when trailer is selected
  useEffect(() => {
    if (selectedTrailer && vehicles.length > 0) {
      const matches = findBestVehicleMatches(vehicles, selectedTrailer)
      setBestMatches(matches)
    } else {
      setBestMatches([])
    }
  }, [selectedTrailer, vehicles])

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    setSelectedVehicle(vehicle || null)
  }

  const handleTrailerSelect = (trailerId: string) => {
    const trailer = trailers.find(t => t.id === trailerId)
    setSelectedTrailer(trailer || null)
  }

  const handleSaveCompatibility = () => {
    if (compatibilityResult && onSaveCompatibility) {
      onSaveCompatibility(compatibilityResult)
    }
  }

  const getStatusIcon = (status: CompatibilityStatus) => {
    switch (status) {
      case CompatibilityStatus.PASS:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case CompatibilityStatus.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case CompatibilityStatus.FAIL:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Vehicle-Trailer Compatibility Explorer
          </CardTitle>
          <CardDescription>
            Check if a vehicle can safely tow a trailer based on capacity, hitch class, and provincial requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Select Vehicle
              </label>
              <Select value={selectedVehicle?.id} onValueChange={handleVehicleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                        <Badge variant="outline" className="ml-2">
                          {vehicle.towingCapacityKg}kg
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trailer Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Select Trailer
              </label>
              <Select value={selectedTrailer?.id} onValueChange={handleTrailerSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a trailer..." />
                </SelectTrigger>
                <SelectContent>
                  {trailers.map((trailer) => (
                    <SelectItem key={trailer.id} value={trailer.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{trailer.type}</span>
                        <Badge variant="outline" className="ml-2">
                          {trailer.requiredTowingCapacityKg}kg
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Province Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Province
              </label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON">Ontario</SelectItem>
                  <SelectItem value="QC">Quebec</SelectItem>
                  <SelectItem value="AB">Alberta</SelectItem>
                  <SelectItem value="BC">British Columbia</SelectItem>
                  <SelectItem value="MB">Manitoba</SelectItem>
                  <SelectItem value="SK">Saskatchewan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Result */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Activity className="h-8 w-8 animate-pulse text-blue-500" />
                  <p className="text-sm text-muted-foreground">Analyzing compatibility...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {compatibilityResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-2 ${
              compatibilityResult.status === CompatibilityStatus.PASS ? 'border-green-500' :
              compatibilityResult.status === CompatibilityStatus.WARNING ? 'border-amber-500' :
              'border-red-500'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(compatibilityResult.status)}
                    {formatCompatibilityDisplay(compatibilityResult).title}
                  </span>
                  <Badge variant={
                    compatibilityResult.status === CompatibilityStatus.PASS ? 'default' :
                    compatibilityResult.status === CompatibilityStatus.WARNING ? 'secondary' :
                    'destructive'
                  }>
                    {compatibilityResult.canTow ? 'Can Tow' : 'Cannot Tow'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {formatCompatibilityDisplay(compatibilityResult).subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capacity Utilization */}
                {compatibilityResult.capacityUtilizationPercent && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity Utilization</span>
                      <span className="font-medium">
                        {compatibilityResult.capacityUtilizationPercent.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={compatibilityResult.capacityUtilizationPercent} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {selectedVehicle?.towingCapacityKg}kg vehicle capacity / {selectedTrailer?.requiredTowingCapacityKg}kg trailer requirement
                    </p>
                  </div>
                )}

                {/* Issues */}
                {compatibilityResult.issues.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Compatibility Issues</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {compatibilityResult.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Warnings */}
                {compatibilityResult.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warnings</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {compatibilityResult.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Provincial Requirements */}
                {provincialRequirements.length > 0 && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Provincial Requirements</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {provincialRequirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Recommendations */}
                {compatibilityResult.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {compatibilityResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {compatibilityResult.canTow && onSaveCompatibility && (
                    <Button onClick={handleSaveCompatibility} className="flex-1">
                      Save Compatibility Check
                    </Button>
                  )}
                  {!compatibilityResult.canTow && bestMatches.length > 0 && (
                    <Button variant="outline" className="flex-1">
                      View Alternative Vehicles
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best Matches */}
      {selectedTrailer && bestMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best Vehicle Matches</CardTitle>
            <CardDescription>
              Top vehicles for towing this trailer, sorted by compatibility score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestMatches.map((match, index) => (
                <motion.div
                  key={match.vehicle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    selectedVehicle?.id === match.vehicle.id ? 'border-blue-500 bg-blue-50' : ''
                  } hover:bg-gray-50 cursor-pointer transition-colors`}
                  onClick={() => setSelectedVehicle(match.vehicle)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {match.vehicle.year} {match.vehicle.make} {match.vehicle.model}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {match.vehicle.towingCapacityKg}kg capacity
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Class {match.vehicle.hitchClass} hitch
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {(match.matchScore * 100).toFixed(0)}% match
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(match.capacityUtilization * 100).toFixed(0)}% utilization
                        </div>
                      </div>
                      {getStatusIcon(match.compatibility.status)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}