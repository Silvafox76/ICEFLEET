import { Suspense } from 'react';
import DashboardContent from '@/components/dashboard/dashboard-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">ICE Fleet Operations Center</h1>
          <p className="text-gray-600 mt-2">
            Real-time fleet management and compliance monitoring for ICE Mitigation Services
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/compatibility">
              <ExternalLink className="h-4 w-4 mr-2" />
              Check Compatibility
            </Link>
          </Button>
          <Button asChild>
            <Link href="/fleet">
              <Truck className="h-4 w-4 mr-2" />
              Fleet Registry
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <Link href="/compatibility">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <ExternalLink className="h-8 w-8 text-blue-500" />
                <span className="text-xs text-gray-500">NEW</span>
              </div>
              <CardTitle className="text-lg">Compatibility Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Instantly check vehicle-trailer compatibility and safety requirements
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-amber-500">
          <Link href="/compliance">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="h-8 w-8 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600">3 ALERTS</span>
              </div>
              <CardTitle className="text-lg">Compliance Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track renewals, insurance, and regulatory compliance
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
          <Link href="/maintenance">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="h-8 w-8 text-green-500" />
                <span className="text-xs text-gray-500">ACTIVE</span>
              </div>
              <CardTitle className="text-lg">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Schedule services and track maintenance history
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <Link href="/reports">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <span className="text-xs text-gray-500">REPORTS</span>
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Fleet performance metrics and cost analysis
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>

      {/* Critical Alerts Bar */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm">Vehicle #FLT-2023 insurance expires in 7 days</span>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Trailer #TRL-005 annual inspection due</span>
              </div>
              <Button size="sm" variant="outline">Schedule</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}