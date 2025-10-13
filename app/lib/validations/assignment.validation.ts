import { z } from 'zod';

const ASSIGNMENT_STATUS = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'] as const;
const PRIORITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const createAssignmentSchema = z.object({
  jobNumber: z.string().min(1, 'Job number is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  trailerId: z.string().optional().nullable(),
  leadDriverId: z.string().min(1, 'Lead driver is required'),
  priority: z.enum(PRIORITY_LEVELS).optional().default('MEDIUM'),
  estimatedHours: z.number().min(0).optional().nullable(),
  status: z.enum(ASSIGNMENT_STATUS).optional().default('SCHEDULED'),
}).refine((data) => {
  if (data.endDate && data.startDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateAssignmentSchema = z.object({
  jobNumber: z.string().min(1, 'Job number is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  trailerId: z.string().optional().nullable(),
  leadDriverId: z.string().min(1, 'Lead driver is required').optional(),
  priority: z.enum(PRIORITY_LEVELS).optional(),
  estimatedHours: z.number().min(0).optional().nullable(),
  status: z.enum(ASSIGNMENT_STATUS).optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
