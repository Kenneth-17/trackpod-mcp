#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { RateLimitedClient } from './client/rate-limiter.js';
import { ToolRegistry } from './utils/tool-registry.js';

class TrackPodMCPServer {
  private server: Server;
  private client: RateLimitedClient;
  private toolRegistry: ToolRegistry;

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
    this.toolRegistry = new ToolRegistry(this.client);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.toolRegistry.getTools(),
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.toolRegistry.callTool(name, args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: result,
                metadata: {
                  timestamp: new Date().toISOString(),
                  tool: name,
                },
              }),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Tool execution error [${name}]:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: {
                  code: error instanceof Error && 'code' in error ? (error as any).code : 'TOOL_EXECUTION_ERROR',
                  message: errorMessage,
                  tool: name,
                },
                metadata: {
                  timestamp: new Date().toISOString(),
                },
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