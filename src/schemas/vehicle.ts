import { z } from 'zod';

// Vehicle creation schema
export const CreateVehicleSchema = z.object({
  number: z.string().min(1, 'Vehicle number is required'),
  type: z.string().optional(),
  capacity: z.number().nonnegative().optional(),
  active: z.boolean().default(true),
});

// Vehicle update schema
export const UpdateVehicleSchema = CreateVehicleSchema.partial().extend({
  id: z.number().optional(),
});

// Query parameters
export const VehicleIdQuerySchema = z.object({
  id: z.number().positive('Vehicle ID must be positive'),
});

// Type exports
export type CreateVehicle = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicle = z.infer<typeof UpdateVehicleSchema>;
export type VehicleIdQuery = z.infer<typeof VehicleIdQuerySchema>;