#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
// import { z } from 'zod';
// import { config } from './config.js';
import { RateLimitedClient } from './client/rate-limiter.js';

// Import resource handlers (to be implemented)
// import { registerOrderTools } from './resources/order.js';
// import { registerRouteTools } from './resources/route.js';
// import { registerDriverTools } from './resources/driver.js';

class TrackPodMCPServer {
  private server: Server;
  private client: RateLimitedClient;

  constructor() {
    this.server = new Server(
      {
        name: 'trackpod-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.client = new RateLimitedClient();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Test endpoint
          {
            name: 'test_ping',
            description: 'Verify API key and check rate limits',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          // Order tools will be added here
          // Route tools will be added here  
          // Driver tools will be added here
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;

      try {
        // Test endpoint
        if (name === 'test_ping') {
          const result = await this.client.get('/Test');
          const rateLimitStatus = await this.client.getCurrentStatus();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  message: 'API connection successful',
                  data: result,
                  rateLimitStatus,
                }),
              },
            ],
          };
        }

        // Additional tool handlers will be added here

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: errorMessage,
              }),
            },
          ],
          isError: true,
        };
      }
    });

    // Log server errors
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Track-POD MCP server started');
  }
}

// Start the server
const server = new TrackPodMCPServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});