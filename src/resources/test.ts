import { RateLimitedClient } from '../client/rate-limiter.js';
import { logger } from '../utils/logger.js';

export class TestResource {
  constructor(private client: RateLimitedClient) {}

  // Ping endpoint to verify API key and rate limits
  async ping(): Promise<{ success: boolean; message: string; timestamp: string; data?: unknown }> {
    try {
      logger.debug('Starting ping test...');
      const result = await this.client.get<unknown>('/Test');
      logger.debug('Ping test successful:', result);
      return {
        success: true,
        message: 'API connection successful',
        timestamp: new Date().toISOString(),
        data: result,
      };
    } catch (error) {
      logger.error('Ping test failed:', error);
      throw error; // Re-throw to let the parent handle the error formatting
    }
  }
}