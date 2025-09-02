
import { Suspense } from 'react';
import MaintenanceOverview from '@/components/maintenance/maintenance-overview';
import { Card } from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Maintenance Management</h1>
          <p className="text-gray-600 mt-2">
            Track and schedule vehicle and trailer maintenance
          </p>
        </div>
      </div>
      
      <Suspense fallback={<MaintenanceSkeleton />}>
        <MaintenanceOverview />
      </Suspense>
    </div>
  );
}

function MaintenanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          </Card>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
