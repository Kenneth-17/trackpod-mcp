import { RateLimitedClient } from '../client/rate-limiter.js';
import { Address } from '../types/index.js';
import { AddressSchema } from '../schemas/order.js';

export class AddressResource {
  constructor(private client: RateLimitedClient) {}

  // Create or update an address
  async createOrUpdate(params: unknown): Promise<Address> {
    const data = AddressSchema.parse(params);
    return this.client.post<Address>('/Address', data);
  }
}