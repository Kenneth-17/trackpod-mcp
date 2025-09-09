import { RateLimitedClient } from '../client/rate-limiter.js';
import { Route, GPSTrack } from '../types/index.js';
import {
  CreateRouteSchema,
  UpdateRouteSchema,
  RouteCodeQuerySchema,
  RouteIdQuerySchema,
  RouteDateQuerySchema,
  AddOrderToRouteSchema,
  OrderToRouteAssignmentSchema,
} from '../schemas/route.js';

export class RouteResource {
  constructor(private client: RateLimitedClient) {}

  // Create a new route
  async create(params: unknown): Promise<Route> {
    const data = CreateRouteSchema.parse(params);
    return this.client.post<Route>('/Route', data);
  }

  // Update route by code
  async updateByCode(params: unknown): Promise<Route> {
    const { code, ...updateData } = { ...RouteCodeQuerySchema.parse(params), ...UpdateRouteSchema.parse(params) };
    return this.client.put<Route>(`/Route/Code/${encodeURIComponent(code)}`, updateData);
  }

  // Get route by code
  async getByCode(params: unknown): Promise<Route> {
    const { code } = RouteCodeQuerySchema.parse(params);
    return this.client.get<Route>(`/Route/Code/${encodeURIComponent(code)}`);
  }

  // Delete route by code
  async deleteByCode(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code } = RouteCodeQuerySchema.parse(params);
    await this.client.delete<void>(`/Route/Code/${encodeURIComponent(code)}`);
    return { success: true, message: `Route ${code} deleted successfully` };
  }

  // Update route by ID
  async updateById(params: unknown): Promise<Route> {
    const { id, ...updateData } = { ...RouteIdQuerySchema.parse(params), ...UpdateRouteSchema.parse(params) };
    return this.client.put<Route>(`/Route/Id/${id}`, updateData);
  }

  // Get route by ID
  async getById(params: unknown): Promise<Route> {
    const { id } = RouteIdQuerySchema.parse(params);
    return this.client.get<Route>(`/Route/Id/${id}`);
  }

  // Delete route by ID
  async deleteById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = RouteIdQuerySchema.parse(params);
    await this.client.delete<void>(`/Route/Id/${id}`);
    return { success: true, message: `Route ID ${id} deleted successfully` };
  }

  // List routes by date
  async listByDate(params: unknown): Promise<Route[]> {
    const { date } = RouteDateQuerySchema.parse(params);
    return this.client.get<Route[]>(`/Route/Date/${date}`);
  }

  // List routes to export by code
  async listToExportByCode(): Promise<string[]> {
    return this.client.get<string[]>('/Route/Export/Code');
  }

  // List routes to export by ID
  async listToExportById(): Promise<number[]> {
    return this.client.get<number[]>('/Route/Export/Id');
  }

  // Confirm route export by code
  async confirmExportByCode(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code } = RouteCodeQuerySchema.parse(params);
    await this.client.put<void>(`/Route/Export/Code/${encodeURIComponent(code)}`);
    return { success: true, message: `Route ${code} marked as exported` };
  }

  // Confirm route export by ID
  async confirmExportById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = RouteIdQuerySchema.parse(params);
    await this.client.put<void>(`/Route/Export/Id/${id}`);
    return { success: true, message: `Route ID ${id} marked as exported` };
  }

  // Add new order to route by code
  async addNewOrderByCode(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code, ...orderData } = { ...RouteCodeQuerySchema.parse(params), ...AddOrderToRouteSchema.parse(params) };
    await this.client.put<void>(`/Route/Code/${encodeURIComponent(code)}/Order`, orderData);
    return { success: true, message: `New order added to route ${code}` };
  }

  // Add new order to route by ID
  async addNewOrderById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id, ...orderData } = { ...RouteIdQuerySchema.parse(params), ...AddOrderToRouteSchema.parse(params) };
    await this.client.put<void>(`/Route/Id/${id}/Order`, orderData);
    return { success: true, message: `New order added to route ID ${id}` };
  }

  // Add existing order to route by code and order number
  async addExistingOrderByCodeAndNumber(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code } = RouteCodeQuerySchema.parse(params);
    const { orderNumber } = OrderToRouteAssignmentSchema.parse(params);
    
    if (!orderNumber) {
      throw new Error('Order number is required');
    }
    
    await this.client.put<void>(`/Route/Code/${encodeURIComponent(code)}/Order/Number/${encodeURIComponent(orderNumber)}`);
    return { success: true, message: `Order ${orderNumber} added to route ${code}` };
  }

  // Add existing order to route by code and order ID
  async addExistingOrderByCodeAndId(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code } = RouteCodeQuerySchema.parse(params);
    const { orderId } = OrderToRouteAssignmentSchema.parse(params);
    
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    
    await this.client.put<void>(`/Route/Code/${encodeURIComponent(code)}/Order/Id/${orderId}`);
    return { success: true, message: `Order ID ${orderId} added to route ${code}` };
  }

  // Add existing order to route by route ID and order number
  async addExistingOrderByIdAndNumber(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = RouteIdQuerySchema.parse(params);
    const { orderNumber } = OrderToRouteAssignmentSchema.parse(params);
    
    if (!orderNumber) {
      throw new Error('Order number is required');
    }
    
    await this.client.put<void>(`/Route/Id/${id}/Order/Number/${encodeURIComponent(orderNumber)}`);
    return { success: true, message: `Order ${orderNumber} added to route ID ${id}` };
  }

  // Add existing order to route by both IDs
  async addExistingOrderByIdAndId(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = RouteIdQuerySchema.parse(params);
    const { orderId } = OrderToRouteAssignmentSchema.parse(params);
    
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    
    await this.client.put<void>(`/Route/Id/${id}/Order/Id/${orderId}`);
    return { success: true, message: `Order ID ${orderId} added to route ID ${id}` };
  }

  // Get GPS track by route code
  async getTrackByCode(params: unknown): Promise<GPSTrack> {
    const { code } = RouteCodeQuerySchema.parse(params);
    return this.client.get<GPSTrack>(`/Route/Track/Code/${encodeURIComponent(code)}`);
  }

  // Get GPS track by route ID
  async getTrackById(params: unknown): Promise<GPSTrack> {
    const { id } = RouteIdQuerySchema.parse(params);
    return this.client.get<GPSTrack>(`/Route/Track/Id/${id}`);
  }

  // Start route by code
  async startByCode(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code } = RouteCodeQuerySchema.parse(params);
    await this.client.put<void>(`/Route/Start/Code/${encodeURIComponent(code)}`);
    return { success: true, message: `Route ${code} started successfully` };
  }

  // Start route by ID
  async startById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = RouteIdQuerySchema.parse(params);
    await this.client.put<void>(`/Route/Start/Id/${id}`);
    return { success: true, message: `Route ID ${id} started successfully` };
  }

  // Close route by code
  async closeByCode(params: unknown): Promise<{ success: boolean; message: string }> {
    const { code } = RouteCodeQuerySchema.parse(params);
    await this.client.put<void>(`/Route/Close/Code/${encodeURIComponent(code)}`);
    return { success: true, message: `Route ${code} closed successfully` };
  }

  // Close route by ID
  async closeById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = RouteIdQuerySchema.parse(params);
    await this.client.put<void>(`/Route/Close/Id/${id}`);
    return { success: true, message: `Route ID ${id} closed successfully` };
  }
}