
import { Suspense } from 'react';
import FleetRegistry from '@/components/fleet/fleet-registry';
import { Card } from '@/components/ui/card';

export default function FleetPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Fleet Registry</h1>
          <p className="text-gray-600 mt-2">
            Manage vehicles and trailers across your Canadian operations
          </p>
        </div>
      </div>
      
      <Suspense fallback={<FleetSkeleton />}>
        <FleetRegistry />
      </Suspense>
    </div>
  );
}

function FleetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  );
}
