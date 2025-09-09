import { z } from 'zod';

// Query parameters for vehicle checks
export const VehicleNumberQuerySchema = z.object({
  number: z.string().min(1, 'Vehicle number is required'),
});

export const VehicleCheckDateQuerySchema = z.object({
  number: z.string().min(1, 'Vehicle number is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const CheckDateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Type exports
export type VehicleNumberQuery = z.infer<typeof VehicleNumberQuerySchema>;
export type VehicleCheckDateQuery = z.infer<typeof VehicleCheckDateQuerySchema>;
export type CheckDateQuery = z.infer<typeof CheckDateQuerySchema>;