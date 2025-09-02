
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Plus, 
  Search,
  MapPin,
  Calendar,
  Users,
  Truck,
  Package,
  Clock,
  Flag
} from 'lucide-react';
import type { Assignment } from '@/lib/types';
import { formatDate } from '@/lib/types';

interface ExtendedAssignment extends Assignment {
  vehicle?: {
    make: string;
    model: string;
    licensePlate: string;
  };
  trailer?: {
    type: string;
    serialNumber: string;
  };
  leadDriver?: {
    firstName: string;
    lastName: string;
  };
  crewMembers?: Array<{
    driver: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export default function AssignmentSystem() {
  const [assignments, setAssignments] = useState<ExtendedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => {
        setAssignments(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching assignments:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <AssignmentsSkeleton />;
  }

  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment?.jobNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      assignment?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      assignment?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || assignment?.status === selectedStatus;
    
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
                placeholder="Search assignments..."
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
                <option value="CANCELLED">Cancelled</option>
              </select>
              
              <Button className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments?.map((assignment) => (
          <AssignmentCard key={assignment?.id} assignment={assignment} />
        ))}
        {!filteredAssignments?.length && (
          <div className="col-span-full">
            <Card className="shadow-sm">
              <CardContent className="text-center py-12">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No assignments found matching your criteria</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: ExtendedAssignment }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'amber';
      case 'IN_PROGRESS': return 'green';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'ON_HOLD': return 'amber';
      default: return 'amber';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'amber';
      case 'MEDIUM': return 'green';
      case 'LOW': return 'green';
      default: return 'green';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold text-[#0B1F3A]">
                {assignment?.jobNumber}
              </CardTitle>
              <StatusBadge status={getPriorityBadge(assignment?.priority ?? '')}>
                {assignment?.priority}
              </StatusBadge>
            </div>
            <CardDescription className="text-sm">
              {assignment?.description}
            </CardDescription>
          </div>
          <StatusBadge status={getStatusBadge(assignment?.status ?? '')}>
            {assignment?.status?.replace('_', ' ')}
          </StatusBadge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Location and Timing */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{assignment?.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Start: {formatDate(assignment?.startDate ?? new Date())}</span>
            </div>
            {assignment?.endDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <Flag className="w-4 h-4" />
                <span>End: {formatDate(assignment.endDate)}</span>
              </div>
            )}
            {assignment?.estimatedHours && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Estimated: {assignment.estimatedHours}h</span>
              </div>
            )}
          </div>

          {/* Resources Assigned */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-medium text-sm text-[#0B1F3A]">Assigned Resources</h4>
            
            {/* Lead Driver */}
            {assignment?.leadDriver && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Lead: {assignment.leadDriver.firstName} {assignment.leadDriver.lastName}</span>
              </div>
            )}

            {/* Additional Crew */}
            {assignment?.crewMembers?.length ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Crew:</span> {assignment.crewMembers.map(member => 
                  `${member?.driver?.firstName} ${member?.driver?.lastName}`
                ).join(', ')}
              </div>
            ) : null}

            {/* Vehicle */}
            {assignment?.vehicle && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>
                  {assignment.vehicle.make} {assignment.vehicle.model} ({assignment.vehicle.licensePlate})
                </span>
              </div>
            )}

            {/* Trailer */}
            {assignment?.trailer && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>
                  {assignment.trailer.type} Trailer ({assignment.trailer.serialNumber})
                </span>
              </div>
            )}

            {/* No Resources Warning */}
            {!assignment?.vehicle && !assignment?.trailer && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                ⚠️ No vehicle or trailer assigned
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
