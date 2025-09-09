import { RateLimitedClient } from '../client/rate-limiter.js';
import { RejectReason } from '../types/index.js';

export class RejectReasonResource {
  constructor(private client: RateLimitedClient) {}

  // List all valid rejection reasons
  async list(): Promise<RejectReason[]> {
    return this.client.get<RejectReason[]>('/RejectReason');
  }
}