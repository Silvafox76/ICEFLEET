
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Package, 
  Plus, 
  Search,
  Filter,
  MapPin,
  Gauge,
  Calendar,
  Settings
} from 'lucide-react';
import type { Vehicle, Trailer } from '@/lib/types';
import { CANADIAN_PROVINCES } from '@/lib/types';

export default function FleetRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Form state
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isTrailerDialogOpen, setIsTrailerDialogOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    licensePlate: '',
    province: 'ON',
    towingCapacity: 0,
    hitchClass: 'Class I',
    status: 'ACTIVE'
  });
  const [trailerForm, setTrailerForm] = useState({
    type: 'Enclosed',
    serialNumber: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    province: 'ON',
    requiredTowingCapacity: 0,
    hitchClass: 'Class I',
    hasBrakes: false,
    status: 'ACTIVE'
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/fleet/vehicles').then(res => res.json()),
      fetch('/api/fleet/trailers').then(res => res.json())
    ]).then(([vehiclesData, trailersData]) => {
      setVehicles(vehiclesData || []);
      setTrailers(trailersData || []);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching fleet data:', error);
      setLoading(false);
    });
  }, []);

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/fleet/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      
      if (response.ok) {
        const newVehicle = await response.json();
        setVehicles([...vehicles, newVehicle]);
        setIsVehicleDialogOpen(false);
        setVehicleForm({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          vin: '',
          licensePlate: '',
          province: 'ON',
          towingCapacity: 0,
          hitchClass: 'Class I',
          status: 'ACTIVE'
        });
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleTrailerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/fleet/trailers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trailerForm)
      });
      
      if (response.ok) {
        const newTrailer = await response.json();
        setTrailers([...trailers, newTrailer]);
        setIsTrailerDialogOpen(false);
        setTrailerForm({
          type: 'Enclosed',
          serialNumber: '',
          year: new Date().getFullYear(),
          licensePlate: '',
          province: 'ON',
          requiredTowingCapacity: 0,
          hitchClass: 'Class I',
          hasBrakes: false,
          status: 'ACTIVE'
        });
      }
    } catch (error) {
      console.error('Error adding trailer:', error);
    }
  };

  if (loading) {
    return <FleetSkeleton />;
  }

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle?.make?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      vehicle?.model?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      vehicle?.licensePlate?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || vehicle?.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) ?? [];

  const filteredTrailers = trailers?.filter(trailer => {
    const matchesSearch = searchTerm === '' || 
      trailer?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      trailer?.serialNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || trailer?.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) ?? [];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fleet assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F80FF] focus:border-[#2F80FF] outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F80FF] focus:border-[#2F80FF] outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
              
              <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
                    <Truck className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>
                      Enter the vehicle details for your fleet registry
                    </DialogDescription>
                  </DialogHeader>
                  <VehicleForm 
                    form={vehicleForm} 
                    setForm={setVehicleForm} 
                    onSubmit={handleVehicleSubmit} 
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isTrailerDialogOpen} onOpenChange={setIsTrailerDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#2F80FF] text-[#2F80FF] hover:bg-[#2F80FF] hover:text-white">
                    <Package className="w-4 h-4 mr-2" />
                    Add Trailer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Trailer</DialogTitle>
                    <DialogDescription>
                      Enter the trailer details for your fleet registry
                    </DialogDescription>
                  </DialogHeader>
                  <TrailerForm 
                    form={trailerForm} 
                    setForm={setTrailerForm} 
                    onSubmit={handleTrailerSubmit} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-semibold text-[#0B1F3A] flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Vehicles ({filteredVehicles?.length ?? 0})
              </CardTitle>
              <CardDescription>Fleet vehicles and their current status</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVehicles?.map((vehicle) => (
                <VehicleCard key={vehicle?.id} vehicle={vehicle} />
              ))}
              {!filteredVehicles?.length && (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No vehicles found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trailers Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-semibold text-[#0B1F3A] flex items-center gap-2">
                <Package className="w-5 h-5" />
                Trailers ({filteredTrailers?.length ?? 0})
              </CardTitle>
              <CardDescription>Trailer inventory and specifications</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTrailers?.map((trailer) => (
                <TrailerCard key={trailer?.id} trailer={trailer} />
              ))}
              {!filteredTrailers?.length && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No trailers found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'MAINTENANCE': return 'amber';
      case 'OUT_OF_SERVICE': return 'red';
      default: return 'amber';
    }
  };

  const provinceName = CANADIAN_PROVINCES?.find(p => p?.code === vehicle?.province)?.name ?? vehicle?.province;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-[#0B1F3A] text-sm">
            {vehicle?.year} {vehicle?.make} {vehicle?.model}
          </h4>
          <StatusBadge status={getStatusBadge(vehicle?.status ?? '')}>
            {vehicle?.status}
          </StatusBadge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">Plate:</span>
            <span>{vehicle?.licensePlate}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{provinceName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Towing:</span>
            <span>{vehicle?.towingCapacity?.toLocaleString()} kg</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            <span>{vehicle?.odometer?.toLocaleString()} km</span>
          </div>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" className="ml-2">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}

function TrailerCard({ trailer }: { trailer: Trailer }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'MAINTENANCE': return 'amber';
      case 'OUT_OF_SERVICE': return 'red';
      default: return 'amber';
    }
  };

  const provinceName = CANADIAN_PROVINCES?.find(p => p?.code === trailer?.province)?.name ?? trailer?.province;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-[#0B1F3A] text-sm">
            {trailer?.type} Trailer
          </h4>
          <StatusBadge status={getStatusBadge(trailer?.status ?? '')}>
            {trailer?.status}
          </StatusBadge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">Serial:</span>
            <span>{trailer?.serialNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{provinceName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Required:</span>
            <span>{trailer?.requiredTowingCapacity?.toLocaleString()} kg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Brakes:</span>
            <span>{trailer?.hasBrakes ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" className="ml-2">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}

function VehicleForm({ form, setForm, onSubmit }: {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={form.make}
            onChange={(e) => setForm({...form, make: e.target.value})}
            placeholder="e.g., Ford, Chevrolet"
            required
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={form.model}
            onChange={(e) => setForm({...form, model: e.target.value})}
            placeholder="e.g., F-150, Silverado"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={form.year}
            onChange={(e) => setForm({...form, year: parseInt(e.target.value)})}
            min="1990"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>
        <div>
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            value={form.vin}
            onChange={(e) => setForm({...form, vin: e.target.value.toUpperCase()})}
            placeholder="17-character VIN"
            maxLength={17}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input
            id="licensePlate"
            value={form.licensePlate}
            onChange={(e) => setForm({...form, licensePlate: e.target.value.toUpperCase()})}
            placeholder="e.g., ABC123"
            required
          />
        </div>
        <div>
          <Label htmlFor="province">Province</Label>
          <Select value={form.province} onValueChange={(value) => setForm({...form, province: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {CANADIAN_PROVINCES.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="towingCapacity">Towing Capacity (kg)</Label>
          <Input
            id="towingCapacity"
            type="number"
            value={form.towingCapacity}
            onChange={(e) => setForm({...form, towingCapacity: parseInt(e.target.value) || 0})}
            placeholder="e.g., 3500"
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="hitchClass">Hitch Class</Label>
          <Select value={form.hitchClass} onValueChange={(value) => setForm({...form, hitchClass: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select hitch class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Class I">Class I (2,000 lbs)</SelectItem>
              <SelectItem value="Class II">Class II (3,500 lbs)</SelectItem>
              <SelectItem value="Class III">Class III (5,000 lbs)</SelectItem>
              <SelectItem value="Class IV">Class IV (10,000 lbs)</SelectItem>
              <SelectItem value="Class V">Class V (20,000+ lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={form.status} onValueChange={(value) => setForm({...form, status: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setForm({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          vin: '',
          licensePlate: '',
          province: 'ON',
          towingCapacity: 0,
          hitchClass: 'Class I',
          status: 'ACTIVE'
        })}>
          Reset
        </Button>
        <Button type="submit" className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
          Add Vehicle
        </Button>
      </div>
    </form>
  );
}

function TrailerForm({ form, setForm, onSubmit }: {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trailerType">Trailer Type</Label>
          <Select value={form.type} onValueChange={(value) => setForm({...form, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select trailer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Enclosed">Enclosed</SelectItem>
              <SelectItem value="Flatbed">Flatbed</SelectItem>
              <SelectItem value="Utility">Utility</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Cargo">Cargo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={form.serialNumber}
            onChange={(e) => setForm({...form, serialNumber: e.target.value.toUpperCase()})}
            placeholder="Trailer serial number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trailerYear">Year</Label>
          <Input
            id="trailerYear"
            type="number"
            value={form.year}
            onChange={(e) => setForm({...form, year: parseInt(e.target.value)})}
            min="1990"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>
        <div>
          <Label htmlFor="trailerPlate">License Plate (if applicable)</Label>
          <Input
            id="trailerPlate"
            value={form.licensePlate}
            onChange={(e) => setForm({...form, licensePlate: e.target.value.toUpperCase()})}
            placeholder="e.g., TRL123"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trailerProvince">Province</Label>
          <Select value={form.province} onValueChange={(value) => setForm({...form, province: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {CANADIAN_PROVINCES.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="requiredTowingCapacity">Required Towing Capacity (kg)</Label>
          <Input
            id="requiredTowingCapacity"
            type="number"
            value={form.requiredTowingCapacity}
            onChange={(e) => setForm({...form, requiredTowingCapacity: parseInt(e.target.value) || 0})}
            placeholder="e.g., 2500"
            min="0"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trailerHitchClass">Required Hitch Class</Label>
          <Select value={form.hitchClass} onValueChange={(value) => setForm({...form, hitchClass: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select hitch class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Class I">Class I (2,000 lbs)</SelectItem>
              <SelectItem value="Class II">Class II (3,500 lbs)</SelectItem>
              <SelectItem value="Class III">Class III (5,000 lbs)</SelectItem>
              <SelectItem value="Class IV">Class IV (10,000 lbs)</SelectItem>
              <SelectItem value="Class V">Class V (20,000+ lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="trailerStatus">Status</Label>
          <Select value={form.status} onValueChange={(value) => setForm({...form, status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasBrakes"
          checked={form.hasBrakes}
          onChange={(e) => setForm({...form, hasBrakes: e.target.checked})}
          className="rounded border-gray-300 text-[#2F80FF] focus:ring-[#2F80FF]"
        />
        <Label htmlFor="hasBrakes">Has electric brakes</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setForm({
          type: 'Enclosed',
          serialNumber: '',
          year: new Date().getFullYear(),
          licensePlate: '',
          province: 'ON',
          requiredTowingCapacity: 0,
          hitchClass: 'Class I',
          hasBrakes: false,
          status: 'ACTIVE'
        })}>
          Reset
        </Button>
        <Button type="submit" className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
          Add Trailer
        </Button>
      </div>
    </form>
  );
}

function FleetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
