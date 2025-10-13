import { z } from 'zod';

const CANADIAN_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK', 'NT', 'NU', 'YT'] as const;
const TRAILER_TYPES = ['ENCLOSED', 'FLATBED', 'UTILITY', 'EQUIPMENT', 'SPECIALTY'] as const;
const TRAILER_STATUS = ['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'RETIRED'] as const;

export const createTrailerSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required'),
  type: z.enum(TRAILER_TYPES),
  requiredTowingCapacityKg: z.number().int().min(0).nullable().optional(),
  requiredHitchClass: z.number().int().min(1).max(5).nullable().optional(),
  hasElectricBrakes: z.boolean().optional().default(false),
  requiresElectricBrakeController: z.boolean().optional().default(false),
  licensePlate: z.string().optional().nullable(),
  province: z.enum(CANADIAN_PROVINCES),
  status: z.enum(TRAILER_STATUS).optional().default('ACTIVE'),
});

export const updateTrailerSchema = createTrailerSchema.partial();

export type CreateTrailerInput = z.infer<typeof createTrailerSchema>;
export type UpdateTrailerInput = z.infer<typeof updateTrailerSchema>;
