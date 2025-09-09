import { RateLimitedClient } from '../client/rate-limiter.js';

export class TestResource {
  constructor(private client: RateLimitedClient) {}

  // Ping endpoint to verify API key and rate limits
  async ping(): Promise<{ success: boolean; message: string; timestamp: string; data?: unknown }> {
    const result = await this.client.get<unknown>('/Test');
    return {
      success: true,
      message: 'API connection successful',
      timestamp: new Date().toISOString(),
      data: result,
    };
  }
}