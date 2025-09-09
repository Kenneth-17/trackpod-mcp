# trackpod-mcp

MCP server integration for Track-POD logistics API. Enables AI agents and applications to interact with Track-POD services through the Model Context Protocol.

## Features

- Full Track-POD API coverage
- Built-in rate limiting (20 req/s, 400 req/min)
- Automatic retry logic for failed requests
- Type-safe method calls with Zod validation
- Support for bulk operations

## Installation

```bash
npm install trackpod-mcp
```

## Configuration

Set your Track-POD API key as an environment variable:

```bash
export TRACKPOD_API_KEY=your_api_key_here
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

## API Documentation

See [Track-POD API docs](https://api.track-pod.com) for detailed endpoint information.

## License

MIT