import Bottleneck from 'bottleneck';
import { config } from '../config.js';
import { TrackPodClient, TrackPodError } from './base.js';
import { logger } from '../utils/logger.js';

export class RateLimitedClient extends TrackPodClient {
  private limiter: Bottleneck;

  constructor() {
    super();
    
    // Configure Bottleneck with Track-POD rate limits
    this.limiter = new Bottleneck({
      // Per-second limit
      reservoir: config.rateLimits.perSecond,
      reservoirRefreshAmount: config.rateLimits.perSecond,
      reservoirRefreshInterval: 1000, // 1 second
      
      // Per-minute limit (as maximum)
      maxConcurrent: 5, // Reasonable concurrent request limit
      minTime: Math.ceil(60000 / config.rateLimits.perMinute), // Minimum time between requests
    });

    // Handle rate limit errors
    this.limiter.on('error', (error) => {
      logger.error('Rate limiter error:', error);
    });

    // Log when we're approaching limits
    this.limiter.on('depleted', () => {
      logger.warn('Rate limiter: Approaching rate limits, queuing requests');
    });

    // Log when rate limit is restored
    this.limiter.on('idle', () => {
      logger.debug('Rate limiter: All queued requests completed');
    });
  }

  // Override parent methods to apply rate limiting
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.limiter.schedule(() => super.get<T>(path, params));
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.limiter.schedule(() => super.post<T>(path, data));
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.limiter.schedule(() => super.put<T>(path, data));
  }

  async delete<T>(path: string): Promise<T> {
    return this.limiter.schedule(() => super.delete<T>(path));
  }

  // Utility method to check current rate limit status
  async getCurrentStatus(): Promise<{
    running: number;
    queued: number;
    reservoir: number | null;
  }> {
    return {
      running: await this.limiter.running(),
      queued: await this.limiter.queued(),
      reservoir: null, // Bottleneck doesn't expose reservoir directly
    };
  }

  // Method to handle 429 responses with backoff
  async handleRateLimitError(error: TrackPodError, retryAfter?: number): Promise<void> {
    if (error.code === 'RATE_LIMIT_ERROR') {
      const delay = retryAfter ? retryAfter * 1000 : 60000; // Default to 1 minute if no retry-after header
      logger.warn(`Rate limit hit. Backing off for ${delay}ms`);
      
      // Pause the limiter
      await this.limiter.stop();
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Note: Bottleneck doesn't have a start() method, it resumes automatically
    }
  }

  // Utility to check if we should preemptively slow down
  async shouldSlowDown(): Promise<boolean> {
    const status = await this.getCurrentStatus();
    
    // Slow down if we have too many queued requests
    return status.queued > config.rateLimits.perSecond * 0.5;
  }
}