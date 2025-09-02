
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wrench, 
  Plus, 
  Search,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import type { MaintenanceRecord } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/types';

interface ExtendedMaintenanceRecord extends MaintenanceRecord {
  vehicle?: {
    make: string;
    model: string;
    licensePlate: string;
  };
  trailer?: {
    type: string;
    serialNumber: string;
  };
}

export default function MaintenanceOverview() {
  const [records, setRecords] = useState<ExtendedMaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Form state
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'PREVENTIVE',
    description: '',
    assetType: 'VEHICLE',
    assetId: '',
    scheduledDate: '',
    priority: 'MEDIUM',
    serviceProvider: '',
    estimatedCost: '',
    notes: ''
  });

  useEffect(() => {
    fetch('/api/maintenance/records')
      .then(res => res.json())
      .then(data => {
        setRecords(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching maintenance records:', error);
        setLoading(false);
      });
  }, []);

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/maintenance/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...maintenanceForm,
          scheduledDate: new Date(maintenanceForm.scheduledDate),
          estimatedCost: maintenanceForm.estimatedCost ? parseFloat(maintenanceForm.estimatedCost) : null
        })
      });
      
      if (response.ok) {
        const newRecord = await response.json();
        setRecords([...records, newRecord]);
        setIsMaintenanceDialogOpen(false);
        setMaintenanceForm({
          type: 'PREVENTIVE',
          description: '',
          assetType: 'VEHICLE',
          assetId: '',
          scheduledDate: '',
          priority: 'MEDIUM',
          serviceProvider: '',
          estimatedCost: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
    }
  };

  if (loading) {
    return <MaintenanceSkeleton />;
  }

  const filteredRecords = records?.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      record?.workOrderNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || record?.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) ?? [];

  // Calculate summary stats
  const totalRecords = records?.length ?? 0;
  const scheduledRecords = records?.filter(r => r?.status === 'SCHEDULED')?.length ?? 0;
  const overdueRecords = records?.filter(r => r?.status === 'OVERDUE')?.length ?? 0;
  const completedRecords = records?.filter(r => r?.status === 'COMPLETED')?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-[#0B1F3A]">{totalRecords}</p>
              </div>
              <Settings className="w-8 h-8 text-[#2F80FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-[#2F80FF]">{scheduledRecords}</p>
              </div>
              <Calendar className="w-8 h-8 text-[#2F80FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-[#D92D20]">{overdueRecords}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-[#D92D20]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-[#11A36A]">{completedRecords}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#11A36A]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search maintenance records..."
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
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue</option>
              </select>
              
              <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule Maintenance</DialogTitle>
                    <DialogDescription>
                      Create a new maintenance record or work order
                    </DialogDescription>
                  </DialogHeader>
                  <MaintenanceForm 
                    form={maintenanceForm} 
                    setForm={setMaintenanceForm} 
                    onSubmit={handleMaintenanceSubmit} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Records List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0B1F3A] flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Maintenance Records
          </CardTitle>
          <CardDescription>All scheduled and completed maintenance work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRecords?.map((record) => (
              <MaintenanceRecordCard key={record?.id} record={record} />
            ))}
            {!filteredRecords?.length && (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No maintenance records found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MaintenanceRecordCard({ record }: { record: ExtendedMaintenanceRecord }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'IN_PROGRESS': return 'amber';
      case 'SCHEDULED': return 'green';
      case 'OVERDUE': return 'red';
      case 'CANCELLED': return 'red';
      default: return 'amber';
    }
  };

  let assetInfo = 'No Asset';
  if (record?.vehicle) {
    assetInfo = `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.licensePlate})`;
  } else if (record?.trailer) {
    assetInfo = `${record.trailer.type} Trailer (${record.trailer.serialNumber})`;
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-[#0B1F3A] text-sm">
            {record?.type?.replace('_', ' ')} - {record?.description}
          </h4>
          <StatusBadge status={getStatusBadge(record?.status ?? '')}>
            {record?.status?.replace('_', ' ')}
          </StatusBadge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">Asset:</span>
            <span>{assetInfo}</span>
          </div>
          
          {record?.scheduledDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Scheduled: {formatDate(record.scheduledDate)}</span>
            </div>
          )}
          
          {record?.completedDate && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Completed: {formatDate(record.completedDate)}</span>
            </div>
          )}
          
          {record?.workOrderNumber && (
            <div className="flex items-center gap-1">
              <span className="font-medium">WO:</span>
              <span>{record.workOrderNumber}</span>
            </div>
          )}
          
          {record?.serviceProvider && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Provider:</span>
              <span>{record.serviceProvider}</span>
            </div>
          )}
          
          {record?.cost && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>{formatCurrency(Number(record.cost))}</span>
            </div>
          )}
          
          {record?.odometer && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Odometer:</span>
              <span>{record.odometer.toLocaleString()} km</span>
            </div>
          )}
        </div>
        
        {record?.notes && (
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Notes:</span> {record.notes}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {record?.status === 'OVERDUE' && (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        )}
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </div>
    </div>
  );
}

function MaintenanceForm({ form, setForm, onSubmit }: {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maintenanceType">Maintenance Type</Label>
          <Select value={form.type} onValueChange={(value) => setForm({...form, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select maintenance type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PREVENTIVE">Preventive Maintenance</SelectItem>
              <SelectItem value="CORRECTIVE">Corrective Repair</SelectItem>
              <SelectItem value="INSPECTION">Inspection</SelectItem>
              <SelectItem value="EMERGENCY">Emergency Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={form.priority} onValueChange={(value) => setForm({...form, priority: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          placeholder="Brief description of maintenance required"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maintenanceAssetType">Asset Type</Label>
          <Select value={form.assetType} onValueChange={(value) => setForm({...form, assetType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VEHICLE">Vehicle</SelectItem>
              <SelectItem value="TRAILER">Trailer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maintenanceAssetId">Asset ID</Label>
          <Input
            id="maintenanceAssetId"
            value={form.assetId}
            onChange={(e) => setForm({...form, assetId: e.target.value})}
            placeholder="Vehicle or Trailer ID"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduledDate">Scheduled Date</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={form.scheduledDate}
            onChange={(e) => setForm({...form, scheduledDate: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
          <Input
            id="estimatedCost"
            type="number"
            value={form.estimatedCost}
            onChange={(e) => setForm({...form, estimatedCost: e.target.value})}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="serviceProvider">Service Provider</Label>
        <Input
          id="serviceProvider"
          value={form.serviceProvider}
          onChange={(e) => setForm({...form, serviceProvider: e.target.value})}
          placeholder="e.g., Main Street Garage, In-house"
        />
      </div>

      <div>
        <Label htmlFor="maintenanceNotes">Notes</Label>
        <Textarea
          id="maintenanceNotes"
          value={form.notes}
          onChange={(e) => setForm({...form, notes: e.target.value})}
          placeholder="Additional details about the maintenance work"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setForm({
          type: 'PREVENTIVE',
          description: '',
          assetType: 'VEHICLE',
          assetId: '',
          scheduledDate: '',
          priority: 'MEDIUM',
          serviceProvider: '',
          estimatedCost: '',
          notes: ''
        })}>
          Reset
        </Button>
        <Button type="submit" className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
          Schedule Maintenance
        </Button>
      </div>
    </form>
  );
}

function MaintenanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
