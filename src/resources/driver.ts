import { RateLimitedClient } from '../client/rate-limiter.js';
import { Driver } from '../types/index.js';
import {
  CreateDriverSchema,
  UpdateDriverSchema,
  DriverIdQuerySchema,
  DriverUsernameQuerySchema,
} from '../schemas/driver.js';

export class DriverResource {
  constructor(private client: RateLimitedClient) {}

  // Get driver by ID
  async getById(params: unknown): Promise<Driver> {
    const { id } = DriverIdQuerySchema.parse(params);
    return this.client.get<Driver>(`/Driver/Id/${id}`);
  }

  // Delete driver by ID
  async deleteById(params: unknown): Promise<{ success: boolean; message: string }> {
    const { id } = DriverIdQuerySchema.parse(params);
    await this.client.delete<void>(`/Driver/Id/${id}`);
    return { success: true, message: `Driver ID ${id} deleted successfully` };
  }

  // Get driver by username
  async getByUsername(params: unknown): Promise<Driver> {
    const { username } = DriverUsernameQuerySchema.parse(params);
    return this.client.get<Driver>(`/Driver/Username/${encodeURIComponent(username)}`);
  }

  // Delete driver by username
  async deleteByUsername(params: unknown): Promise<{ success: boolean; message: string }> {
    const { username } = DriverUsernameQuerySchema.parse(params);
    await this.client.delete<void>(`/Driver/Username/${encodeURIComponent(username)}`);
    return { success: true, message: `Driver ${username} deleted successfully` };
  }

  // List all drivers
  async list(): Promise<Driver[]> {
    return this.client.get<Driver[]>('/Driver');
  }

  // Create a new driver
  async create(params: unknown): Promise<Driver> {
    const data = CreateDriverSchema.parse(params);
    return this.client.post<Driver>('/Driver', data);
  }

  // Update an existing driver
  async update(params: unknown): Promise<Driver> {
    const data = UpdateDriverSchema.parse(params);
    return this.client.put<Driver>('/Driver', data);
  }
}