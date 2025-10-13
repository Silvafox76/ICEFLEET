import { z } from 'zod';

const CANADIAN_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK', 'NT', 'NU', 'YT'] as const;
const VEHICLE_STATUS = ['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'RETIRED'] as const;

export const createVehicleSchema = z.object({
  vin: z.string().length(17, 'VIN must be exactly 17 characters'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, 'License plate is required'),
  towingCapacityKg: z.number().int().min(0).nullable().optional(),
  hitchClass: z.number().int().min(1).max(5).nullable().optional(),
  hasElectricBrakeController: z.boolean().optional().default(false),
  fuelType: z.string().min(1, 'Fuel type is required'),
  province: z.enum(CANADIAN_PROVINCES),
  odometer: z.number().int().min(0).optional().default(0),
  status: z.enum(VEHICLE_STATUS).optional().default('ACTIVE'),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
