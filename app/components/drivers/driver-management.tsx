
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Award,
  AlertTriangle
} from 'lucide-react';
import type { Driver } from '@/lib/types';
import { CANADIAN_PROVINCES, calculateDaysUntilExpiry, getComplianceStatus, formatDate } from '@/lib/types';

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Form state
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [driverForm, setDriverForm] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseClass: 'G',
    licenseNumber: '',
    licenseExpiry: '',
    endorsements: [] as string[],
    province: 'ON',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetch('/api/drivers')
      .then(res => res.json())
      .then(data => {
        setDrivers(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching drivers:', error);
        setLoading(false);
      });
  }, []);

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...driverForm,
          licenseExpiry: new Date(driverForm.licenseExpiry)
        })
      });
      
      if (response.ok) {
        const newDriver = await response.json();
        setDrivers([...drivers, newDriver]);
        setIsDriverDialogOpen(false);
        setDriverForm({
          employeeId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseClass: 'G',
          licenseNumber: '',
          licenseExpiry: '',
          endorsements: [],
          province: 'ON',
          status: 'ACTIVE'
        });
      }
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  if (loading) {
    return <DriversSkeleton />;
  }

  const filteredDrivers = drivers?.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      `${driver?.firstName} ${driver?.lastName}`?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      driver?.employeeId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      driver?.licenseNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || driver?.status === selectedStatus;
    
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
                placeholder="Search drivers..."
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
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
              
              <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Driver
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Driver</DialogTitle>
                    <DialogDescription>
                      Enter the driver details and license information
                    </DialogDescription>
                  </DialogHeader>
                  <DriverForm 
                    form={driverForm} 
                    setForm={setDriverForm} 
                    onSubmit={handleDriverSubmit} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers?.map((driver) => (
          <DriverCard key={driver?.id} driver={driver} />
        ))}
        {!filteredDrivers?.length && (
          <div className="col-span-full">
            <Card className="shadow-sm">
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No drivers found matching your criteria</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function DriverCard({ driver }: { driver: Driver }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'ON_LEAVE': return 'amber';
      case 'INACTIVE': 
      case 'TERMINATED': return 'red';
      default: return 'amber';
    }
  };

  const provinceName = CANADIAN_PROVINCES?.find(p => p?.code === driver?.province)?.name ?? driver?.province;
  const daysUntilExpiry = calculateDaysUntilExpiry(driver?.licenseExpiry ?? new Date());
  const licenseStatus = getComplianceStatus(daysUntilExpiry);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-[#0B1F3A]">
              {driver?.firstName} {driver?.lastName}
            </CardTitle>
            <CardDescription className="text-sm">
              Employee ID: {driver?.employeeId}
            </CardDescription>
          </div>
          <StatusBadge status={getStatusBadge(driver?.status ?? '')}>
            {driver?.status}
          </StatusBadge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{driver?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{driver?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{provinceName}</span>
            </div>
          </div>

          {/* License Info */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2F80FF]" />
                <span className="text-sm font-medium">License: {driver?.licenseClass}</span>
              </div>
              <StatusBadge status={licenseStatus} className="text-xs">
                {daysUntilExpiry > 0 ? `${daysUntilExpiry}d` : 'Expired'}
              </StatusBadge>
            </div>
            
            <div className="text-xs text-gray-600">
              <p>Number: {driver?.licenseNumber}</p>
              <p className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Expires: {formatDate(driver?.licenseExpiry ?? new Date())}
              </p>
            </div>

            {driver?.endorsements?.length ? (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Endorsements:</p>
                <div className="flex flex-wrap gap-1">
                  {driver.endorsements.map((endorsement, idx) => (
                    <span 
                      key={idx}
                      className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-md"
                    >
                      {endorsement}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* License Warning */}
          {licenseStatus === 'red' && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-700">
                License {daysUntilExpiry <= 0 ? 'expired' : 'expires soon'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DriverForm({ form, setForm, onSubmit }: {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [endorsementInput, setEndorsementInput] = useState('');
  
  const addEndorsement = () => {
    if (endorsementInput.trim() && !form.endorsements.includes(endorsementInput.trim())) {
      setForm({
        ...form,
        endorsements: [...form.endorsements, endorsementInput.trim()]
      });
      setEndorsementInput('');
    }
  };

  const removeEndorsement = (endorsement: string) => {
    setForm({
      ...form,
      endorsements: form.endorsements.filter((e: string) => e !== endorsement)
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={form.employeeId}
            onChange={(e) => setForm({...form, employeeId: e.target.value})}
            placeholder="e.g., EMP001"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(value) => setForm({...form, status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setForm({...form, firstName: e.target.value})}
            placeholder="First name"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setForm({...form, lastName: e.target.value})}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            placeholder="driver@company.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            placeholder="(416) 555-0123"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="licenseClass">License Class</Label>
          <Select value={form.licenseClass} onValueChange={(value) => setForm({...form, licenseClass: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select license class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="G">Class G (Regular)</SelectItem>
              <SelectItem value="G2">Class G2 (Novice)</SelectItem>
              <SelectItem value="D">Class D (Truck/Bus)</SelectItem>
              <SelectItem value="A">Class A (Tractor-Trailer)</SelectItem>
              <SelectItem value="B">Class B (School Bus)</SelectItem>
              <SelectItem value="C">Class C (Regular Bus)</SelectItem>
              <SelectItem value="E">Class E (School Bus - Large)</SelectItem>
              <SelectItem value="F">Class F (Regular Bus - Large)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input
            id="licenseNumber"
            value={form.licenseNumber}
            onChange={(e) => setForm({...form, licenseNumber: e.target.value})}
            placeholder="Driver license number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="licenseExpiry">License Expiry</Label>
          <Input
            id="licenseExpiry"
            type="date"
            value={form.licenseExpiry}
            onChange={(e) => setForm({...form, licenseExpiry: e.target.value})}
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

      <div>
        <Label>Endorsements</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={endorsementInput}
            onChange={(e) => setEndorsementInput(e.target.value)}
            placeholder="e.g., Z (Air Brakes)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEndorsement())}
          />
          <Button type="button" onClick={addEndorsement} variant="outline" size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.endorsements.map((endorsement: string, idx: number) => (
            <span 
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#2F80FF] bg-opacity-10 text-[#2F80FF] text-xs rounded-md"
            >
              {endorsement}
              <button
                type="button"
                onClick={() => removeEndorsement(endorsement)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setForm({
          employeeId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseClass: 'G',
          licenseNumber: '',
          licenseExpiry: '',
          endorsements: [],
          province: 'ON',
          status: 'ACTIVE'
        })}>
          Reset
        </Button>
        <Button type="submit" className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
          Add Driver
        </Button>
      </div>
    </form>
  );
}

function DriversSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
