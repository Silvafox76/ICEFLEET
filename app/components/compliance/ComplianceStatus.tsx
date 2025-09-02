'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import type { ComplianceStatus as ComplianceStatusType } from '@/lib/compliance/compliance-tracker';

interface ComplianceStatusProps {
  status: ComplianceStatusType | null;
}

export function ComplianceStatus({ status }: ComplianceStatusProps) {
  if (!status) {
    return <ComplianceStatusSkeleton />;
  }

  const getOverallStatusConfig = () => {
    switch (status.overall) {
      case 'COMPLIANT':
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          description: 'All systems operational and compliant'
        };
      case 'WARNING':
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          description: 'Some items require attention soon'
        };
      case 'CRITICAL':
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          description: 'Immediate action required for compliance'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: <Activity className="w-5 h-5 text-gray-600" />,
          description: 'Status unknown'
        };
    }
  };

  const overallConfig = getOverallStatusConfig();
  const compliancePercentage = status.totalAssets > 0 
    ? Math.round((status.compliantAssets / status.totalAssets) * 100)
    : 0;

  const warningPercentage = status.totalAssets > 0
    ? Math.round((status.warningAssets / status.totalAssets) * 100)
    : 0;

  const criticalPercentage = status.totalAssets > 0
    ? Math.round((status.criticalAssets / status.totalAssets) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <Card className={`border-2 ${overallConfig.color}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {overallConfig.icon}
            <div>
              <span className="text-2xl font-bold">Fleet Compliance Status</span>
              <Badge className={`ml-3 px-3 py-1 ${overallConfig.color}`}>
                {status.overall}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription className="text-base">
            {overallConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Compliance Percentage */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
                <span className="text-2xl font-bold text-green-600">{compliancePercentage}%</span>
              </div>
              <Progress value={compliancePercentage} className="h-3" />
              <p className="text-xs text-gray-600">
                {status.compliantAssets} of {status.totalAssets} assets compliant
              </p>
            </div>

            {/* Warning Assets */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Warning Level</span>
                <span className="text-2xl font-bold text-yellow-600">{warningPercentage}%</span>
              </div>
              <Progress value={warningPercentage} className="h-3 [&>div]:bg-yellow-500" />
              <p className="text-xs text-gray-600">
                {status.warningAssets} assets need attention
              </p>
            </div>

            {/* Critical Assets */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Critical Level</span>
                <span className="text-2xl font-bold text-red-600">{criticalPercentage}%</span>
              </div>
              <Progress value={criticalPercentage} className="h-3 [&>div]:bg-red-500" />
              <p className="text-xs text-gray-600">
                {status.criticalAssets} assets require immediate action
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliant Assets */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Compliant Assets</p>
                <p className="text-2xl font-bold text-green-800">{status.compliantAssets}</p>
                <p className="text-xs text-green-600 mt-1">
                  {compliancePercentage}% of total fleet
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Warning Assets */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Warning Assets</p>
                <p className="text-2xl font-bold text-yellow-800">{status.warningAssets}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Need attention soon
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* Critical Assets */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Critical Assets</p>
                <p className="text-2xl font-bold text-red-800">{status.criticalAssets}</p>
                <p className="text-xs text-red-600 mt-1">
                  Immediate action required
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Documents</p>
                <p className="text-2xl font-bold text-blue-800">
                  {status.expiredDocuments + status.expiringDocuments}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Require renewal action
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Status Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Document Status Overview
          </CardTitle>
          <CardDescription>
            Current state of all compliance documents across the fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expired Documents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Expired Documents</span>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  {status.expiredDocuments}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 ml-5">
                Documents that have passed their expiry date and require immediate renewal
              </p>
            </div>

            {/* Expiring Soon */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Expiring Soon</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  {status.expiringDocuments}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 ml-5">
                Documents expiring within 30 days that should be scheduled for renewal
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#0B1F3A]">{status.totalAssets}</p>
                <p className="text-sm text-gray-600">Total Assets</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{status.compliantAssets}</p>
                <p className="text-sm text-gray-600">Compliant</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{status.warningAssets}</p>
                <p className="text-sm text-gray-600">Warning</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{status.criticalAssets}</p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComplianceStatusSkeleton() {
  return (
    <div className="space-y-6">
      {/* Overall Status Skeleton */}
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Document Details Skeleton */}
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}