import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export interface TrackPodError {
  code: string;
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class TrackPodClient {
  private client: AxiosInstance;
  private requestId = 0;

  constructor() {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'X-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding correlation ID
    this.client.interceptors.request.use(
      (request) => {
        const correlationId = `req-${Date.now()}-${++this.requestId}`;
        request.headers['X-Correlation-ID'] = correlationId;
        
        // Log request (without sensitive data)
        logger.debug(`[${correlationId}] ${request.method?.toUpperCase()} ${request.url}`);
        
        return request;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor for error handling and retry logic
    this.client.interceptors.response.use(
      (response) => {
        const correlationId = response.config.headers?.['X-Correlation-ID'];
        logger.debug(`[${correlationId}] Response: ${response.status}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };
        
        // Retry logic for 5xx errors
        if (error.response?.status && error.response.status >= 500 && error.response.status < 600) {
          originalRequest._retry = (originalRequest._retry || 0) + 1;
          
          if (originalRequest._retry <= 3) {
            const delay = Math.pow(2, originalRequest._retry) * 1000; // Exponential backoff
            logger.debug(`Retrying request after ${delay}ms (attempt ${originalRequest._retry}/3)`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.client.request(originalRequest);
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): TrackPodError {
    const correlationId = error.config?.headers?.['X-Correlation-ID'];
    
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      let code: string;
      let message: string;
      
      switch (statusCode) {
        case 400:
          code = 'VALIDATION_ERROR';
          message = 'Invalid request parameters';
          break;
        case 401:
          code = 'AUTHENTICATION_ERROR';
          message = 'Invalid or missing API key';
          break;
        case 403:
          code = 'AUTHORIZATION_ERROR';
          message = 'Insufficient permissions';
          break;
        case 404:
          code = 'RESOURCE_NOT_FOUND';
          message = 'Requested resource not found';
          break;
        case 409:
          code = 'CONFLICT_ERROR';
          message = 'Invalid state transition or conflict';
          break;
        case 429:
          code = 'RATE_LIMIT_ERROR';
          message = 'Rate limit exceeded';
          break;
        default:
          if (statusCode >= 500) {
            code = 'SERVER_ERROR';
            message = 'Track-POD service error';
          } else {
            code = 'REQUEST_ERROR';
            message = `Request failed with status ${statusCode}`;
          }
      }
      
      logger.error(`[${correlationId}] Error ${statusCode}: ${message}`);
      
      return {
        code,
        message,
        statusCode,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response received
      logger.error(`[${correlationId}] No response received`);
      return {
        code: 'NETWORK_ERROR',
        message: 'No response from Track-POD service',
        details: error.message,
      };
    } else {
      // Error setting up the request
      logger.error(`[${correlationId}] Request setup error: ${error.message}`);
      return {
        code: 'REQUEST_SETUP_ERROR',
        message: error.message || 'Failed to setup request',
      };
    }
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(path, { params });
    return response.data;
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }

  async delete<T>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }
}