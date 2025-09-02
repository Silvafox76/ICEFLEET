
import { Suspense } from 'react';
import DriverManagement from '@/components/drivers/driver-management';
import { Card } from '@/components/ui/card';

export default function DriversPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Driver Management</h1>
          <p className="text-gray-600 mt-2">
            Manage driver profiles, licenses, and certifications
          </p>
        </div>
      </div>
      
      <Suspense fallback={<DriversSkeleton />}>
        <DriverManagement />
      </Suspense>
    </div>
  );
}

function DriversSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  );
}
