import { z } from 'zod';

// Address schema
export const AddressSchema = z.object({
  name: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

// Consignee schema
export const ConsigneeSchema = z.object({
  name: z.string().min(1, 'Consignee name is required'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// Order item schema
export const OrderItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  weight: z.number().nonnegative().optional(),
  value: z.number().nonnegative().optional(),
  barcode: z.string().optional(),
});

// Time window schema
export const TimeWindowSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

// Order creation schema
export const CreateOrderSchema = z.object({
  number: z.string().min(1, 'Order number is required'),
  trackId: z.string().optional(),
  consignee: ConsigneeSchema,
  address: AddressSchema,
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  deliveryDate: z.string().optional(),
  timeWindow: TimeWindowSchema.optional(),
  notes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// Order update schema
export const UpdateOrderSchema = CreateOrderSchema.partial().extend({
  id: z.number().optional(),
  number: z.string().optional(),
});

// Bulk create schema
export const BulkCreateOrderSchema = z.object({
  orders: z.array(CreateOrderSchema).min(1).max(500, 'Maximum 500 orders allowed in bulk operation'),
});

// Order completion schema
export const CompleteOrderSchema = z.object({
  status: z.string().default('delivered'),
  signature: z.string().optional(),
  notes: z.string().optional(),
  completedAt: z.string().optional(),
});

// Order rejection schema
export const RejectOrderSchema = z.object({
  reasonId: z.number().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  rejectedAt: z.string().optional(),
});

// Query parameters
export const OrderQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const RouteQuerySchema = z.object({
  code: z.string().min(1, 'Route code is required'),
});

export const OrderNumberQuerySchema = z.object({
  number: z.string().min(1, 'Order number is required'),
});

export const OrderIdQuerySchema = z.object({
  id: z.number().positive('Order ID must be positive'),
});

export const TrackIdQuerySchema = z.object({
  trackId: z.string().min(1, 'Track ID is required'),
});

// Type exports
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
export type BulkCreateOrder = z.infer<typeof BulkCreateOrderSchema>;
export type CompleteOrder = z.infer<typeof CompleteOrderSchema>;
export type RejectOrder = z.infer<typeof RejectOrderSchema>;
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
export type RouteQuery = z.infer<typeof RouteQuerySchema>;
export type OrderNumberQuery = z.infer<typeof OrderNumberQuerySchema>;
export type OrderIdQuery = z.infer<typeof OrderIdQuerySchema>;
export type TrackIdQuery = z.infer<typeof TrackIdQuerySchema>;