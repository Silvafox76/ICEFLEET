
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Truck, 
  Users, 
  ClipboardList, 
  AlertTriangle,
  Wrench,
  TrendingUp,
  Calendar,
  Shield,
  Package
} from 'lucide-react';
import type { DashboardStats, ComplianceAlert } from '@/lib/types';

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/stats').then(res => res.json()),
      fetch('/api/compliance/alerts').then(res => res.json())
    ]).then(([statsData, alertsData]) => {
      setStats(statsData);
      setAlerts(alertsData?.alerts || []);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Vehicles"
          value={stats?.fleet?.totalVehicles ?? 0}
          icon={<Truck className="w-5 h-5 text-[#2F80FF]" />}
          change={`${stats?.fleet?.activeVehicles ?? 0} active`}
          changeType="positive"
        />
        <MetricCard
          title="Active Drivers"
          value={stats?.fleet?.totalDrivers ?? 0}
          icon={<Users className="w-5 h-5 text-[#11A36A]" />}
          change="All certified"
          changeType="positive"
        />
        <MetricCard
          title="Total Trailers"
          value={stats?.fleet?.totalTrailers ?? 0}
          icon={<Package className="w-5 h-5 text-[#F59E0B]" />}
          change="All operational"
          changeType="positive"
        />
        <MetricCard
          title="Fleet Utilization"
          value={`${stats?.utilization?.averageUtilization ?? 0}%`}
          icon={<TrendingUp className="w-5 h-5 text-[#2F80FF]" />}
          change={`${stats?.utilization?.vehiclesInUse ?? 0} in use`}
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Alerts */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-semibold text-[#0B1F3A] flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance Alerts
              </CardTitle>
              <CardDescription>Documents requiring attention</CardDescription>
            </div>
            {alerts?.filter(alert => alert?.priority === 'critical')?.length ? (
              <StatusBadge status="red">
                {alerts.filter(alert => alert?.priority === 'critical').length} Critical
              </StatusBadge>
            ) : null}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts?.slice(0, 5)?.map((alert) => (
                <div key={alert?.id} className="flex items-center justify-between p-3 rounded-md border bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#0B1F3A]">
                      {alert?.entityName || alert?.documentNumber} - {alert?.type}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {alert?.daysUntilExpiry > 0 ? `Expires in ${alert?.daysUntilExpiry} days` : `Expired ${Math.abs(alert?.daysUntilExpiry)} days ago`}
                    </p>
                  </div>
                  <StatusBadge status={alert?.priority === 'critical' ? 'red' : alert?.priority === 'warning' ? 'amber' : 'green'}>
                    {alert?.daysUntilExpiry > 0 ? `${alert?.daysUntilExpiry}d` : 'Expired'}
                  </StatusBadge>
                </div>
              ))}
              {!alerts?.length && (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>All compliance documents are up to date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Overview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[#0B1F3A] flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Maintenance Overview
            </CardTitle>
            <CardDescription>Upcoming and overdue maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-md border bg-gray-50">
                <div>
                  <p className="font-medium text-sm text-[#0B1F3A]">Scheduled This Week</p>
                  <p className="text-xs text-gray-600">Regular maintenance</p>
                </div>
                <span className="text-lg font-bold text-[#2F80FF]">
                  {stats?.maintenance?.scheduled ?? 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-md border bg-yellow-50">
                <div>
                  <p className="font-medium text-sm text-[#0B1F3A]">Overdue Items</p>
                  <p className="text-xs text-gray-600">Requires attention</p>
                </div>
                <StatusBadge status="amber">
                  {stats?.maintenance?.overdue ?? 0} items
                </StatusBadge>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-md border bg-gray-50">
                <div>
                  <p className="font-medium text-sm text-[#0B1F3A]">Next 30 Days</p>
                  <p className="text-xs text-gray-600">Upcoming services</p>
                </div>
                <span className="text-lg font-bold text-[#11A36A]">
                  {stats?.compliance?.renewalsDue30Days ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0B1F3A]">Quick Actions</CardTitle>
          <CardDescription>Common fleet management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickActionButton
              href="/fleet"
              icon={<Truck className="w-5 h-5" />}
              title="Fleet Registry"
              description="View vehicles & trailers"
            />
            <QuickActionButton
              href="/drivers"
              icon={<Users className="w-5 h-5" />}
              title="Driver Management"
              description="Manage driver profiles"
            />
            <QuickActionButton
              href="/compliance"
              icon={<Shield className="w-5 h-5" />}
              title="Compliance Hub"
              description="Track renewals & docs"
            />
            <QuickActionButton
              href="/maintenance"
              icon={<Wrench className="w-5 h-5" />}
              title="Maintenance Records"
              description="View service history"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function MetricCard({ title, value, icon, change, changeType = 'neutral' }: MetricCardProps) {
  const changeColor = {
    positive: 'text-[#11A36A]',
    negative: 'text-[#D92D20]',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-[#0B1F3A] mb-2 animated-counter">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <p className={`text-xs ${changeColor}`}>{change}</p>
            )}
          </div>
          <div className="ml-4">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionButtonProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickActionButton({ href, icon, title, description }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-[#2F80FF] hover:bg-blue-50 transition-all group"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-[#2F80FF] bg-opacity-10 rounded-lg flex items-center justify-center group-hover:bg-[#2F80FF] group-hover:bg-opacity-100 transition-colors">
        <div className="text-[#2F80FF] group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <p className="font-medium text-[#0B1F3A] text-sm">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </a>
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
