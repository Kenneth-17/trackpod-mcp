import { RateLimitedClient } from '../client/rate-limiter.js';
import { Vehicle } from '../types/index.js';
import {
  CreateVehicleSchema,
  UpdateVehicleSchema,
  VehicleIdQuerySchema,
} from '../schemas/vehicle.js';

export class VehicleResource {
  constructor(private client: RateLimitedClient) {}

  // Get vehicle by ID
  async getById(params: unknown): Promise<Vehicle> {
    const { id } = VehicleIdQuerySchema.parse(params);
    return this.client.get<Vehicle>(`/Vehicle/${id}`);
  }

  // Delete vehicle by ID
  async deleteById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = VehicleIdQuerySchema.parse(params);
    await this.client.delete<void>(`/Vehicle/${id}`);
    return { success: true, message: `Vehicle ID ${id} deleted successfully` };
  }

  // List all vehicles
  async list(): Promise<Vehicle[]> {
    return this.client.get<Vehicle[]>('/Vehicle');
  }

  // Create a new vehicle
  async create(params: unknown): Promise<Vehicle> {
    const data = CreateVehicleSchema.parse(params);
    return this.client.post<Vehicle>('/Vehicle', data);
  }

  // Update an existing vehicle
  async update(params: unknown): Promise<Vehicle> {
    const data = UpdateVehicleSchema.parse(params);
    return this.client.put<Vehicle>('/Vehicle', data);
  }
}