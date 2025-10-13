import { z } from 'zod';

const MAINTENANCE_TYPES = ['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'INSPECTION', 'RECALL'] as const;
const MAINTENANCE_STATUS = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'] as const;

export const createMaintenanceSchema = z.object({
  type: z.enum(MAINTENANCE_TYPES),
  description: z.string().min(1, 'Description is required'),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  odometer: z.number().int().min(0).optional().nullable(),
  cost: z.number().min(0).optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  trailerId: z.string().optional().nullable(),
  serviceProvider: z.string().optional().nullable(),
  workOrderNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  cloudStoragePath: z.string().optional().nullable(),
  status: z.enum(MAINTENANCE_STATUS).optional().default('SCHEDULED'),
}).refine((data) => data.vehicleId || data.trailerId, {
  message: 'Either vehicleId or trailerId must be provided',
  path: ['vehicleId'],
});

export const updateMaintenanceSchema = z.object({
  type: z.enum(MAINTENANCE_TYPES).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  odometer: z.number().int().min(0).optional().nullable(),
  cost: z.number().min(0).optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  trailerId: z.string().optional().nullable(),
  serviceProvider: z.string().optional().nullable(),
  workOrderNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  cloudStoragePath: z.string().optional().nullable(),
  status: z.enum(MAINTENANCE_STATUS).optional(),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
