'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Truck,
  Users,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import type { ComplianceStatus, RenewalAlert } from '@/lib/compliance/compliance-tracker';
import { ComplianceStatus as ComplianceStatusComponent } from './ComplianceStatus';
import { RenewalsList } from './RenewalsList';
import { DocumentUpload } from './DocumentUpload';

interface GroupedRenewals {
  critical: RenewalAlert[];
  high: RenewalAlert[];
  medium: RenewalAlert[];
  low: RenewalAlert[];
  all: RenewalAlert[];
}

export function ComplianceHub() {
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [renewals, setRenewals] = useState<GroupedRenewals | null>(null);
  const [timeline, setTimeline] = useState<{ month: string; renewals: RenewalAlert[] }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      const [statusResponse, renewalsResponse, timelineResponse] = await Promise.all([
        fetch('/api/compliance/status'),
        fetch('/api/compliance/renewals'),
        fetch('/api/compliance/renewals?filter=timeline')
      ]);

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setComplianceStatus(statusData);
      }

      if (renewalsResponse.ok) {
        const renewalsData = await renewalsResponse.json();
        setRenewals(renewalsData);
      }

      if (timelineResponse.ok) {
        const timelineData = await timelineResponse.json();
        setTimeline(timelineData);
      }
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  if (loading) {
    return <ComplianceHubSkeleton />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'text-green-600 bg-green-50 border-green-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Renewals & Compliance Hub
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor compliance status and manage upcoming renewals
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={`px-3 py-1 border ${getStatusColor(complianceStatus?.overall || 'COMPLIANT')}`}>
            Fleet Status: {complianceStatus?.overall || 'Loading...'}
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-[#0B1F3A]">
                  {complianceStatus?.totalAssets || 0}
                </p>
              </div>
              <Truck className="w-8 h-8 text-[#2F80FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {complianceStatus?.compliantAssets || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(complianceStatus?.warningAssets || 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {complianceStatus?.criticalAssets || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Status Component */}
          <ComplianceStatusComponent status={complianceStatus} />

          {/* Critical Renewals Alert */}
          {renewals?.critical && renewals.critical.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Renewals Required
                </CardTitle>
                <CardDescription className="text-red-700">
                  {renewals.critical.length} item{renewals.critical.length === 1 ? '' : 's'} require immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {renewals.critical.slice(0, 3).map((renewal) => (
                    <div key={renewal.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-red-900">{renewal.title}</p>
                        <p className="text-sm text-red-700">{renewal.assetName}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        {renewal.daysUntilExpiry <= 0 ? 'Expired' : `${renewal.daysUntilExpiry} days`}
                      </Badge>
                    </div>
                  ))}
                  {renewals.critical.length > 3 && (
                    <Button
                      onClick={() => setActiveTab('renewals')}
                      variant="link"
                      className="text-red-600 p-0 h-auto"
                    >
                      View all {renewals.critical.length} critical renewals →
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeline?.[0]?.renewals?.slice(0, 5).map((renewal) => (
                    <div key={renewal.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{renewal.title}</p>
                        <p className="text-xs text-gray-600">{renewal.assetName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {renewal.daysUntilExpiry <= 0 ? 'Overdue' : `${renewal.daysUntilExpiry}d`}
                      </Badge>
                    </div>
                  ))}
                  {timeline?.[0]?.renewals?.length === 0 && (
                    <p className="text-gray-500 text-sm">No renewals this month</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiring Soon</span>
                    <span className="font-medium text-yellow-600">
                      {complianceStatus?.expiringDocuments || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expired</span>
                    <span className="font-medium text-red-600">
                      {complianceStatus?.expiredDocuments || 0}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <Button
                      onClick={() => setActiveTab('documents')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Manage Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="renewals" className="space-y-4">
          <RenewalsList renewals={renewals} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Renewal Timeline - Next 12 Months
              </CardTitle>
              <CardDescription>
                Plan ahead with this monthly breakdown of upcoming renewals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {timeline?.map((month) => (
                  <div key={month.month} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#0B1F3A]">{month.month}</h3>
                      <Badge variant="outline">
                        {month.renewals.length} renewal{month.renewals.length === 1 ? '' : 's'}
                      </Badge>
                    </div>
                    
                    {month.renewals.length > 0 ? (
                      <div className="space-y-2">
                        {month.renewals.map((renewal) => (
                          <div key={renewal.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium">{renewal.title}</p>
                              <p className="text-xs text-gray-600">{renewal.assetName}</p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                className={
                                  renewal.status === 'red' ? 'bg-red-100 text-red-800' :
                                  renewal.status === 'amber' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }
                              >
                                {renewal.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No renewals scheduled</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentUpload onUploadComplete={fetchData} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Compliance Reports
              </CardTitle>
              <CardDescription>
                Generate and download compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Full Compliance Report</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Complete overview of all assets and their compliance status
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Critical Issues Report</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Focus on expired and critical compliance issues
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Renewal Schedule</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Upcoming renewals for planning and budgeting
                  </p>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Provincial Compliance</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Province-specific requirements and status
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComplianceHubSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-80 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}