
'use client';

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'green' | 'amber' | 'red';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge 
      className={cn(
        "text-xs font-medium px-2 py-1 rounded-md",
        {
          'status-green': status === 'green',
          'status-amber': status === 'amber',
          'status-red': status === 'red',
        },
        className
      )}
    >
      {children}
    </Badge>
  );
}
