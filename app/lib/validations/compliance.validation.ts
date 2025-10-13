import { z } from 'zod';

const DOCUMENT_TYPES = ['INSURANCE', 'REGISTRATION', 'INSPECTION', 'COMMERCIAL_PERMIT', 'SPECIAL_PERMIT'] as const;
const DOCUMENT_STATUS = ['VALID', 'EXPIRED', 'EXPIRING_SOON', 'SUSPENDED', 'CANCELLED'] as const;

export const createComplianceDocumentSchema = z.object({
  type: z.enum(DOCUMENT_TYPES),
  documentNumber: z.string().min(1, 'Document number is required'),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  vehicleId: z.string().optional().nullable(),
  trailerId: z.string().optional().nullable(),
  cloudStoragePath: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(DOCUMENT_STATUS).optional().default('VALID'),
}).refine((data) => data.vehicleId || data.trailerId, {
  message: 'Either vehicleId or trailerId must be provided',
  path: ['vehicleId'],
}).refine((data) => data.expiryDate > data.issueDate, {
  message: 'Expiry date must be after issue date',
  path: ['expiryDate'],
});

export const updateComplianceDocumentSchema = z.object({
  type: z.enum(DOCUMENT_TYPES).optional(),
  documentNumber: z.string().min(1, 'Document number is required').optional(),
  issueDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  vehicleId: z.string().optional().nullable(),
  trailerId: z.string().optional().nullable(),
  cloudStoragePath: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(DOCUMENT_STATUS).optional(),
});

export type CreateComplianceDocumentInput = z.infer<typeof createComplianceDocumentSchema>;
export type UpdateComplianceDocumentInput = z.infer<typeof updateComplianceDocumentSchema>;
