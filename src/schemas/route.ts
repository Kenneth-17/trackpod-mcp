import { z } from 'zod';

// Route creation schema
export const CreateRouteSchema = z.object({
  code: z.string().min(1, 'Route code is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  driver: z.union([z.number(), z.string()]).optional(),
  vehicle: z.union([z.number(), z.string()]).optional(),
  orders: z.array(z.union([z.number(), z.string()])).optional(),
  notes: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Route update schema  
export const UpdateRouteSchema = CreateRouteSchema.partial();

// Query parameters
export const RouteCodeQuerySchema = z.object({
  code: z.string().min(1, 'Route code is required'),
});

export const RouteIdQuerySchema = z.object({
  id: z.number().positive('Route ID must be positive'),
});

export const RouteDateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Order assignment schemas
export const AddOrderToRouteSchema = z.object({
  number: z.string().optional(),
  orderId: z.number().optional(),
  consignee: z.object({
    name: z.string().min(1, 'Consignee name is required'),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  address: z.object({
    name: z.string().optional(),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().positive('Quantity must be positive'),
    weight: z.number().nonnegative().optional(),
    value: z.number().nonnegative().optional(),
  })).optional(),
  deliveryDate: z.string().optional(),
  timeWindow: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
}).refine(
  (data) => data.number || data.orderId || (data.consignee && data.address && data.items),
  {
    message: 'Either order number, order ID, or complete order details (consignee, address, items) must be provided',
  }
);

export const OrderToRouteAssignmentSchema = z.object({
  orderNumber: z.string().optional(),
  orderId: z.number().optional(),
}).refine(
  (data) => data.orderNumber || data.orderId,
  {
    message: 'Either order number or order ID must be provided',
  }
);

// Type exports
export type CreateRoute = z.infer<typeof CreateRouteSchema>;
export type UpdateRoute = z.infer<typeof UpdateRouteSchema>;
export type RouteCodeQuery = z.infer<typeof RouteCodeQuerySchema>;
export type RouteIdQuery = z.infer<typeof RouteIdQuerySchema>;
export type RouteDateQuery = z.infer<typeof RouteDateQuerySchema>;
export type AddOrderToRoute = z.infer<typeof AddOrderToRouteSchema>;
export type OrderToRouteAssignment = z.infer<typeof OrderToRouteAssignmentSchema>;