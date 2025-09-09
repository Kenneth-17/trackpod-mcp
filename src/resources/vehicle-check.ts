import { RateLimitedClient } from '../client/rate-limiter.js';
import { VehicleCheck } from '../types/index.js';
import {
  VehicleNumberQuerySchema,
  VehicleCheckDateQuerySchema,
  CheckDateQuerySchema,
} from '../schemas/vehicle-check.js';

export class VehicleCheckResource {
  constructor(private client: RateLimitedClient) {}

  // Get last check by vehicle number
  async getLastByNumber(params: unknown): Promise<VehicleCheck> {
    const { number } = VehicleNumberQuerySchema.parse(params);
    return this.client.get<VehicleCheck>(`/VehicleCheck/${encodeURIComponent(number)}`);
  }

  // Get checks by vehicle number and date
  async getByNumberAndDate(params: unknown): Promise<VehicleCheck[]> {
    const { number, date } = VehicleCheckDateQuerySchema.parse(params);
    return this.client.get<VehicleCheck[]>(`/VehicleCheck/Number/${encodeURIComponent(number)}/Date/${date}`);
  }

  // List checks by date
  async listByDate(params: unknown): Promise<VehicleCheck[]> {
    const { date } = CheckDateQuerySchema.parse(params);
    return this.client.get<VehicleCheck[]>(`/VehicleCheck/Date/${date}`);
  }
}