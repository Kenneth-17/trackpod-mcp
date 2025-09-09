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

The server exposes Track-POD functionality through namespaced methods:

### Orders
- `orders.create` - Create new orders
- `orders.update` - Update existing orders
- `orders.bulkCreate` - Create up to 500 orders at once
- `orders.getByNumber` - Retrieve orders by number
- `orders.complete` - Mark orders as delivered
- `orders.reject` - Mark orders as failed

### Routes
- `routes.create` - Create delivery routes
- `routes.addOrder` - Assign orders to routes
- `routes.start` - Start route execution
- `routes.close` - Complete routes
- `routes.getTrack` - Get GPS tracking data

### Drivers
- `drivers.create` - Add new drivers
- `drivers.list` - List all drivers
- `drivers.update` - Update driver information

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