import { z } from 'zod';

// Driver creation schema
export const CreateDriverSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  vehicle: z.number().optional(),
  depot: z.string().optional(),
  active: z.boolean().default(true),
});

// Driver update schema
export const UpdateDriverSchema = CreateDriverSchema.partial().extend({
  id: z.number().optional(),
});

// Query parameters
export const DriverIdQuerySchema = z.object({
  id: z.number().positive('Driver ID must be positive'),
});

export const DriverUsernameQuerySchema = z.object({
  username: z.string().min(1, 'Username is required'),
});

// Type exports
export type CreateDriver = z.infer<typeof CreateDriverSchema>;
export type UpdateDriver = z.infer<typeof UpdateDriverSchema>;
export type DriverIdQuery = z.infer<typeof DriverIdQuerySchema>;
export type DriverUsernameQuery = z.infer<typeof DriverUsernameQuerySchema>;