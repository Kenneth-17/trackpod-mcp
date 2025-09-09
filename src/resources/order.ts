import { RateLimitedClient } from '../client/rate-limiter.js';
import { Order, BulkOperationResult } from '../types/index.js';
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  BulkCreateOrderSchema,
  CompleteOrderSchema,
  RejectOrderSchema,
  OrderQuerySchema,
  RouteQuerySchema,
  OrderNumberQuerySchema,
  OrderIdQuerySchema,
  TrackIdQuerySchema,
  type CreateOrder,
  type UpdateOrder,
  type BulkCreateOrder,
  type CompleteOrder,
  type RejectOrder,
} from '../schemas/order.js';

export class OrderResource {
  constructor(private client: RateLimitedClient) {}

  // Create a new order
  async create(params: unknown): Promise<Order> {
    const data = CreateOrderSchema.parse(params);
    return this.client.post<Order>('/Order', data);
  }

  // Update an existing order
  async update(params: unknown): Promise<Order> {
    const data = UpdateOrderSchema.parse(params);
    return this.client.put<Order>('/Order', data);
  }

  // Create multiple orders (bulk operation)
  async bulkCreate(params: unknown): Promise<BulkOperationResult<Order>> {
    const data = BulkCreateOrderSchema.parse(params);
    
    try {
      const result = await this.client.post<Order[]>('/Order/Bulk', data);
      return {
        successful: result,
        failed: [],
        summary: {
          total: data.orders.length,
          successful: result.length,
          failed: 0,
        },
      };
    } catch (error) {
      // Handle partial failures in bulk operations
      return {
        successful: [],
        failed: data.orders.map(order => ({
          item: order as Order,
          error: error instanceof Error ? error.message : 'Unknown error',
        })),
        summary: {
          total: data.orders.length,
          successful: 0,
          failed: data.orders.length,
        },
      };
    }
  }

  // Get order by number
  async getByNumber(params: unknown): Promise<Order> {
    const { number } = OrderNumberQuerySchema.parse(params);
    return this.client.get<Order>(`/Order/Number/${encodeURIComponent(number)}`);
  }

  // Delete order by number
  async deleteByNumber(params: unknown): Promise<{ success: boolean; message: string }> {
    const { number } = OrderNumberQuerySchema.parse(params);
    await this.client.delete<void>(`/Order/Number/${encodeURIComponent(number)}`);
    return { success: true, message: `Order ${number} deleted successfully` };
  }

  // Get order by ID
  async getById(params: unknown): Promise<Order> {
    const { id } = OrderIdQuerySchema.parse(params);
    return this.client.get<Order>(`/Order/Id/${id}`);
  }

  // Delete order by ID
  async deleteById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = OrderIdQuerySchema.parse(params);
    await this.client.delete<void>(`/Order/Id/${id}`);
    return { success: true, message: `Order ID ${id} deleted successfully` };
  }

  // Get order by tracking ID
  async getByTrackId(params: unknown): Promise<Order> {
    const { trackId } = TrackIdQuerySchema.parse(params);
    return this.client.get<Order>(`/Order/TrackId/${encodeURIComponent(trackId)}`);
  }

  // Update order by tracking ID
  async updateByTrackId(params: unknown): Promise<Order> {
    const { trackId, ...updateData } = { ...TrackIdQuerySchema.parse(params), ...UpdateOrderSchema.parse(params) };
    return this.client.put<Order>(`/Order/TrackId/${encodeURIComponent(trackId)}`, updateData);
  }

  // List orders by date
  async listByDate(params: unknown): Promise<Order[]> {
    const { date } = OrderQuerySchema.parse(params);
    return this.client.get<Order[]>(`/Order/Date/${date}`);
  }

  // List orders by route date
  async listByRouteDate(params: unknown): Promise<Order[]> {
    const { date } = OrderQuerySchema.parse(params);
    return this.client.get<Order[]>(`/Order/Route/Date/${date}`);
  }

  // List orders by route code
  async listByRouteCode(params: unknown): Promise<Order[]> {
    const { code } = RouteQuerySchema.parse(params);
    return this.client.get<Order[]>(`/Order/Route/Code/${encodeURIComponent(code)}`);
  }

  // List orders modified after date
  async listStatusAfterDate(params: unknown): Promise<Order[]> {
    const { date } = OrderQuerySchema.parse(params);
    return this.client.get<Order[]>(`/Order/Status/Date/${date}`);
  }

  // Get 25 most recent orders
  async listRecentByNumber(params: unknown): Promise<Order[]> {
    const { number } = OrderNumberQuerySchema.parse(params);
    return this.client.get<Order[]>(`/Order/Number/${encodeURIComponent(number)}/List`);
  }

  // Download POD document by order number
  async downloadPodByNumber(params: unknown): Promise<{ url: string; data?: Buffer }> {
    const { number } = OrderNumberQuerySchema.parse(params);
    const data = await this.client.get<Buffer>(`/Order/Number/${encodeURIComponent(number)}/Pdf`);
    return {
      url: `/Order/Number/${encodeURIComponent(number)}/Pdf`,
      data,
    };
  }

  // Download POD document by order ID
  async downloadPodById(params: unknown): Promise<{ url: string; data?: Buffer }> {
    const { id } = OrderIdQuerySchema.parse(params);
    const data = await this.client.get<Buffer>(`/Order/Id/${id}/Pdf`);
    return {
      url: `/Order/Id/${id}/Pdf`,
      data,
    };
  }

  // Get shipping label by order number
  async getShippingLabelByNumber(params: unknown): Promise<{ url: string; data?: Buffer }> {
    const { number } = OrderNumberQuerySchema.parse(params);
    const data = await this.client.get<Buffer>(`/Order/Number/${encodeURIComponent(number)}/Shipping-label`);
    return {
      url: `/Order/Number/${encodeURIComponent(number)}/Shipping-label`,
      data,
    };
  }

  // Get shipping label by order ID
  async getShippingLabelById(params: unknown): Promise<{ url: string; data?: Buffer }> {
    const { id } = OrderIdQuerySchema.parse(params);
    const data = await this.client.get<Buffer>(`/Order/Id/${id}/Shipping-label`);
    return {
      url: `/Order/Id/${id}/Shipping-label`,
      data,
    };
  }

  // Complete order by number
  async completeByNumber(params: unknown): Promise<{ success: boolean; message: string }> {
    const { number } = OrderNumberQuerySchema.parse(params);
    const completionData = CompleteOrderSchema.parse(params);
    await this.client.put<void>(`/Order/Number/${encodeURIComponent(number)}/Complete`, completionData);
    return { success: true, message: `Order ${number} marked as completed` };
  }

  // Complete order by ID
  async completeById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = OrderIdQuerySchema.parse(params);
    const completionData = CompleteOrderSchema.parse(params);
    await this.client.put<void>(`/Order/Id/${id}/Complete`, completionData);
    return { success: true, message: `Order ID ${id} marked as completed` };
  }

  // Complete order by tracking ID
  async completeByTrackId(params: unknown): Promise<{ success: boolean; message: string }> {
    const { trackId } = TrackIdQuerySchema.parse(params);
    const completionData = CompleteOrderSchema.parse(params);
    await this.client.put<void>(`/Order/TrackId/${encodeURIComponent(trackId)}/Complete`, completionData);
    return { success: true, message: `Order ${trackId} marked as completed` };
  }

  // Reject order by number
  async rejectByNumber(params: unknown): Promise<{ success: boolean; message: string }> {
    const { number } = OrderNumberQuerySchema.parse(params);
    const rejectionData = RejectOrderSchema.parse(params);
    await this.client.put<void>(`/Order/Number/${encodeURIComponent(number)}/Reject`, rejectionData);
    return { success: true, message: `Order ${number} marked as rejected` };
  }

  // Reject order by ID
  async rejectById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = OrderIdQuerySchema.parse(params);
    const rejectionData = RejectOrderSchema.parse(params);
    await this.client.put<void>(`/Order/Id/${id}/Reject`, rejectionData);
    return { success: true, message: `Order ID ${id} marked as rejected` };
  }

  // Reject order by tracking ID
  async rejectByTrackId(params: unknown): Promise<{ success: boolean; message: string }> {
    const { trackId } = TrackIdQuerySchema.parse(params);
    const rejectionData = RejectOrderSchema.parse(params);
    await this.client.put<void>(`/Order/TrackId/${encodeURIComponent(trackId)}/Reject`, rejectionData);
    return { success: true, message: `Order ${trackId} marked as rejected` };
  }
}