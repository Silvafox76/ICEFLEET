'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Calendar,
  Clock,
  Search,
  Filter,
  FileText,
  User,
  Truck,
  CheckCircle,
  ArrowRight,
  Download,
  Shield
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import type { RenewalAlert } from '@/lib/compliance/compliance-tracker';
import { formatDate } from '@/lib/types';

interface RenewalsListProps {
  renewals: {
    critical: RenewalAlert[];
    high: RenewalAlert[];
    medium: RenewalAlert[];
    low: RenewalAlert[];
    all: RenewalAlert[];
  } | null;
}

export function RenewalsList({ renewals }: RenewalsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'priority' | 'chronological'>('priority');

  if (!renewals) {
    return <RenewalsListSkeleton />;
  }

  const filteredRenewals = renewals.all.filter(renewal => {
    const matchesSearch = searchTerm === '' ||
      renewal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'all' || renewal.priority === filterPriority;
    const matchesType = filterType === 'all' || renewal.type === filterType;

    return matchesSearch && matchesPriority && matchesType;
  });

  const getRenewalIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-4 h-4" />;
      case 'LICENSE': return <User className="w-4 h-4" />;
      case 'REGISTRATION': return <Truck className="w-4 h-4" />;
      case 'INSPECTION': return <CheckCircle className="w-4 h-4" />;
      case 'INSURANCE': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const groupedRenewals = {
    critical: renewals.critical.filter(r => filteredRenewals.includes(r)),
    high: renewals.high.filter(r => filteredRenewals.includes(r)),
    medium: renewals.medium.filter(r => filteredRenewals.includes(r)),
    low: renewals.low.filter(r => filteredRenewals.includes(r))
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Renewals
              </CardTitle>
              <CardDescription>
                {filteredRenewals.length} of {renewals.all.length} renewals shown
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'priority' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('priority')}
              >
                By Priority
              </Button>
              <Button
                variant={viewMode === 'chronological' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('chronological')}
              >
                By Date
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search renewals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Priority Filter */}
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DOCUMENT">Documents</SelectItem>
                <SelectItem value="LICENSE">Licenses</SelectItem>
                <SelectItem value="REGISTRATION">Registrations</SelectItem>
                <SelectItem value="INSPECTION">Inspections</SelectItem>
                <SelectItem value="INSURANCE">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Critical"
          count={groupedRenewals.critical.length}
          color="red"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <SummaryCard
          title="High Priority"
          count={groupedRenewals.high.length}
          color="orange"
          icon={<Clock className="w-5 h-5" />}
        />
        <SummaryCard
          title="Medium Priority"
          count={groupedRenewals.medium.length}
          color="yellow"
          icon={<Calendar className="w-5 h-5" />}
        />
        <SummaryCard
          title="Low Priority"
          count={groupedRenewals.low.length}
          color="blue"
          icon={<CheckCircle className="w-5 h-5" />}
        />
      </div>

      {/* Renewals List */}
      {viewMode === 'priority' ? (
        <div className="space-y-6">
          {/* Critical Renewals */}
          {groupedRenewals.critical.length > 0 && (
            <RenewalSection
              title="Critical Renewals"
              description="Require immediate attention"
              renewals={groupedRenewals.critical}
              priority="CRITICAL"
            />
          )}

          {/* High Priority Renewals */}
          {groupedRenewals.high.length > 0 && (
            <RenewalSection
              title="High Priority Renewals"
              description="Should be addressed soon"
              renewals={groupedRenewals.high}
              priority="HIGH"
            />
          )}

          {/* Medium Priority Renewals */}
          {groupedRenewals.medium.length > 0 && (
            <RenewalSection
              title="Medium Priority Renewals"
              description="Plan ahead for these renewals"
              renewals={groupedRenewals.medium}
              priority="MEDIUM"
            />
          )}

          {/* Low Priority Renewals */}
          {groupedRenewals.low.length > 0 && (
            <RenewalSection
              title="Low Priority Renewals"
              description="Good to be aware of"
              renewals={groupedRenewals.low}
              priority="LOW"
            />
          )}
        </div>
      ) : (
        <RenewalSection
          title="All Renewals"
          description="Sorted by expiry date"
          renewals={filteredRenewals.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)}
          priority="ALL"
        />
      )}

      {filteredRenewals.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No renewals found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryCard({ title, count, color, icon }: {
  title: string;
  count: number;
  color: 'red' | 'orange' | 'yellow' | 'blue';
  icon: React.ReactNode;
}) {
  const colorClasses = {
    red: 'text-red-600 bg-red-50 border-red-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className="opacity-60">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RenewalSection({ title, description, renewals, priority }: {
  title: string;
  description: string;
  renewals: RenewalAlert[];
  priority: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description} ({renewals.length} items)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {renewals.map((renewal) => (
            <RenewalCard key={renewal.id} renewal={renewal} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RenewalCard({ renewal }: { renewal: RenewalAlert }) {
  const getRenewalIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-4 h-4" />;
      case 'LICENSE': return <User className="w-4 h-4" />;
      case 'REGISTRATION': return <Truck className="w-4 h-4" />;
      case 'INSPECTION': return <CheckCircle className="w-4 h-4" />;
      case 'INSURANCE': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-1">
          {getRenewalIcon(renewal.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-[#0B1F3A] text-sm truncate">
              {renewal.title}
            </h4>
            <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(renewal.priority)}`}>
              {renewal.priority}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{renewal.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="font-medium">Asset:</span>
              <span className="truncate">{renewal.assetName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Due: {formatDate(renewal.expiryDate)}</span>
            </div>
          </div>

          {renewal.actionRequired && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
              <strong>Action Required:</strong> {renewal.actionRequired}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <StatusBadge status={renewal.status}>
          {renewal.daysUntilExpiry <= 0 ? 'Expired' : `${renewal.daysUntilExpiry} days`}
        </StatusBadge>
        
        <Button variant="ghost" size="sm" className="gap-1">
          Action
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function RenewalsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}