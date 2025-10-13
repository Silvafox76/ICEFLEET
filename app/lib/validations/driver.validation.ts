import { z } from 'zod';

const CANADIAN_PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK', 'NT', 'NU', 'YT'] as const;
const DRIVER_STATUS = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'] as const;

export const createDriverSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseClass: z.string().min(1, 'License class is required'),
  licenseExpiry: z.coerce.date().refine((date) => date > new Date(), {
    message: 'License expiry must be in the future',
  }),
  endorsements: z.array(z.string()).optional().default([]),
  province: z.enum(CANADIAN_PROVINCES),
  status: z.enum(DRIVER_STATUS).optional().default('ACTIVE'),
});

export const updateDriverSchema = createDriverSchema.partial();

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
