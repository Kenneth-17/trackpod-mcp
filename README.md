# trackpod-mcp

MCP server integration for Track-POD logistics API. Enables AI agents and applications to interact with Track-POD services through the Model Context Protocol.

## Features

- Full Track-POD API coverage
- Built-in rate limiting (20 req/s, 400 req/min)
- Automatic retry logic for failed requests
- Type-safe method calls with Zod validation
- Support for bulk operations

## Quick Start

### Option 1: Use with Claude Desktop

1. Clone this repository:
```bash
git clone https://github.com/Kenneth-17/trackpod-mcp.git
cd trackpod-mcp
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Configure Claude Desktop (see [Claude Desktop Integration](#claude-desktop-integration) below)

### Option 2: Local Development

```bash
npm install trackpod-mcp
```

## Configuration

Set your Track-POD API key as an environment variable:

```bash
export TRACKPOD_API_KEY=your_api_key_here
```

Or create a `.env` file:
```
TRACKPOD_API_KEY=your_api_key_here
```

## Usage

The server exposes Track-POD functionality through MCP tools. Here are some examples:

### Creating an Order
```json
{
  "tool": "orders_create",
  "arguments": {
    "number": "ORD-2024-001",
    "consignee": {
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com"
    },
    "address": {
      "street": "123 Main St",
      "city": "New York", 
      "postalCode": "10001",
      "country": "US"
    },
    "items": [
      {
        "name": "Product A",
        "quantity": 2,
        "weight": 5.5
      }
    ]
  }
}
```

### Starting a Route
```json
{
  "tool": "routes_start_by_code",
  "arguments": {
    "code": "ROUTE-2024-01-15-001"
  }
}
```

### Available Tools

**Order Management (18 tools):**
- `orders_create`, `orders_update`, `orders_bulk_create`
- `orders_get_by_number`, `orders_complete_by_number`, `orders_reject_by_number`
- `orders_list_by_date` and more...

**Route Management (20+ tools):**
- `routes_create`, `routes_get_by_code`, `routes_start_by_code`
- `routes_close_by_code`, `routes_add_order_by_code`, `routes_get_track_by_code`
- And many more route operations...

**Driver & Vehicle Management:**
- `drivers_create`, `drivers_list`, `drivers_get_by_username`
- `vehicles_create`, `vehicles_list`

**Utilities:**
- `test_ping` - Test API connectivity
- `reject_reasons_list` - Get valid rejection reasons

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Claude Desktop Integration

### Setup Instructions

1. **Locate your Claude Desktop configuration file**:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/claude/claude_desktop_config.json`

2. **Add the Track-POD MCP server configuration**:

```json
{
  "mcpServers": {
    "trackpod": {
      "command": "node",
      "args": ["/absolute/path/to/trackpod-mcp/dist/index.js"],
      "env": {
        "TRACKPOD_API_KEY": "your_trackpod_api_key_here"
      }
    }
  }
}
```

3. **Restart Claude Desktop** to load the MCP server

4. **Verify the connection** by asking Claude:
   - "Can you test the Track-POD connection?"
   - Claude will use the `test_ping` tool to verify the API connection

### Example Conversations

**Order Management:**
```
You: "Create a new order for John Doe at 123 Main St, New York"
Claude: I'll create that order for you... [uses orders_create tool]

You: "Check the status of order ORD-2025-001"
Claude: Let me look up that order... [uses orders_get_by_number tool]
```

**Route Planning:**
```
You: "Show me today's unassigned orders and create optimal routes"
Claude: I'll check today's orders and create routes... [uses multiple tools]

You: "Start all morning routes and notify drivers"
Claude: Starting routes now... [uses routes_start_by_code tool]
```

**Fleet Management:**
```
You: "Add a new driver named Mike Johnson with vehicle TRUCK-005"
Claude: I'll add the driver and vehicle... [uses drivers_create and vehicles_create]

You: "Which drivers are available right now?"
Claude: Let me check driver availability... [uses drivers_list tool]
```

### Common Workflows

1. **Daily Dispatch Routine**
   - Review pending orders
   - Create and optimize routes
   - Assign drivers and vehicles
   - Start routes and monitor progress

2. **Customer Service**
   - Look up order status
   - Handle delivery exceptions
   - Process rejections or completions
   - Update customer information

3. **Real-time Tracking**
   - Monitor active routes
   - Check GPS locations
   - Handle route deviations
   - Manage delivery confirmations

4. **Bulk Operations**
   - Import orders from spreadsheets
   - Batch update order statuses
   - Generate daily reports
   - Archive completed deliveries

## Testing

### Using MCP Inspector

Test the MCP server without Claude Desktop:

```bash
npm run inspector
```

This opens a visual interface at `http://localhost:5173` where you can:
- View all available tools
- Test individual tool calls
- See request/response data
- Debug integration issues

## API Documentation

See [Track-POD API docs](https://api.track-pod.com) for detailed endpoint information.

## Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Ensure TRACKPOD_API_KEY is set in your environment or claude_desktop_config.json
   - Check that the .env file is in the project root directory

2. **"Connection refused" error**
   - Verify the MCP server path in Claude Desktop config is absolute
   - Ensure you've run `npm run build` after any changes
   - Check that Node.js is installed and accessible

3. **"Rate limit exceeded" error**
   - The server automatically handles rate limiting
   - If persistent, check your Track-POD account limits

4. **Tools not appearing in Claude**
   - Restart Claude Desktop after configuration changes
   - Verify the MCP server is listed in the config file
   - Check Claude Desktop logs for startup errors

## License

MIT