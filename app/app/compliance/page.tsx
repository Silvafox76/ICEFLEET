
import { Suspense } from 'react';
import { ComplianceHub } from '@/components/compliance/ComplianceHub';
import { Card } from '@/components/ui/card';

export default function CompliancePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">Renewals & Compliance Hub</h1>
          <p className="text-gray-600 mt-2">
            Monitor compliance status and manage upcoming renewals across all fleet assets
          </p>
        </div>
      </div>
      
      <Suspense fallback={<ComplianceSkeleton />}>
        <ComplianceHub />
      </Suspense>
    </div>
  );
}

function ComplianceSkeleton() {
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
