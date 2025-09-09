import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  apiKey: z.string().min(1, 'TRACKPOD_API_KEY is required'),
  baseUrl: z.string().url().default('https://api.track-pod.com'),
  timeout: z.number().positive().default(10000),
  rateLimits: z.object({
    perSecond: z.number().positive().default(20),
    perMinute: z.number().positive().default(400),
  }),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const config = {
    apiKey: process.env.TRACKPOD_API_KEY || '',
    baseUrl: process.env.TRACKPOD_BASE_URL || 'https://api.track-pod.com',
    timeout: process.env.TRACKPOD_TIMEOUT ? parseInt(process.env.TRACKPOD_TIMEOUT, 10) : 10000,
    rateLimits: {
      perSecond: process.env.TRACKPOD_RATE_LIMIT_PER_SECOND 
        ? parseInt(process.env.TRACKPOD_RATE_LIMIT_PER_SECOND, 10) 
        : 20,
      perMinute: process.env.TRACKPOD_RATE_LIMIT_PER_MINUTE 
        ? parseInt(process.env.TRACKPOD_RATE_LIMIT_PER_MINUTE, 10) 
        : 400,
    },
  };

  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(`Configuration validation failed:\n${issues}`);
    }
    throw error;
  }
}

export const config = loadConfig();