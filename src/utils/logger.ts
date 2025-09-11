// Logger utility for MCP server
// IMPORTANT: MCP servers using STDIO must NEVER write to stdout
// All logs must go to stderr to avoid corrupting JSON-RPC communication

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.DEBUG === 'true') {
      console.error(`[DEBUG] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    console.error(`[INFO] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.error(`[WARN] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  }
};