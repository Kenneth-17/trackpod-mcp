import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OrderResource } from '../resources/order.js';
import { RouteResource } from '../resources/route.js';
import { DriverResource } from '../resources/driver.js';
import { VehicleResource } from '../resources/vehicle.js';
import { RejectReasonResource } from '../resources/reject-reason.js';
import { TestResource } from '../resources/test.js';
import { RateLimitedClient } from '../client/rate-limiter.js';

export class ToolRegistry {
  private orderResource: OrderResource;
  private routeResource: RouteResource;
  private driverResource: DriverResource;
  private vehicleResource: VehicleResource;
  private rejectReasonResource: RejectReasonResource;
  private testResource: TestResource;

  constructor(client: RateLimitedClient) {
    this.orderResource = new OrderResource(client);
    this.routeResource = new RouteResource(client);
    this.driverResource = new DriverResource(client);
    this.vehicleResource = new VehicleResource(client);
    this.rejectReasonResource = new RejectReasonResource(client);
    this.testResource = new TestResource(client);
  }

  getTools(): Tool[] {
    return [
      // Test tools
      {
        name: 'test_ping',
        description: 'Verify API key and check connection status',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },

      // Order tools
      {
        name: 'orders_create',
        description: 'Create a new order',
        inputSchema: {
          type: 'object',
          properties: {
            number: { type: 'string', description: 'Order number' },
            trackId: { type: 'string', description: 'Optional tracking ID' },
            consignee: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string' },
              },
              required: ['name'],
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                postalCode: { type: 'string' },
                country: { type: 'string' },
              },
              required: ['street', 'city', 'postalCode', 'country'],
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  quantity: { type: 'number' },
                  weight: { type: 'number' },
                },
                required: ['name', 'quantity'],
              },
            },
            notes: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
          },
          required: ['number', 'consignee', 'address', 'items'],
        },
      },

      {
        name: 'orders_update',
        description: 'Update an existing order',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Order ID' },
            number: { type: 'string', description: 'Order number' },
            notes: { type: 'string' },
          },
        },
      },

      {
        name: 'orders_bulk_create',
        description: 'Create multiple orders (up to 500)',
        inputSchema: {
          type: 'object',
          properties: {
            orders: {
              type: 'array',
              maxItems: 500,
              items: {
                type: 'object',
                properties: {
                  number: { type: 'string' },
                  consignee: { type: 'object' },
                  address: { type: 'object' },
                  items: { type: 'array' },
                },
                required: ['number', 'consignee', 'address', 'items'],
              },
            },
          },
          required: ['orders'],
        },
      },

      {
        name: 'orders_get_by_number',
        description: 'Get order by order number',
        inputSchema: {
          type: 'object',
          properties: {
            number: { type: 'string', description: 'Order number' },
          },
          required: ['number'],
        },
      },

      {
        name: 'orders_complete_by_number',
        description: 'Mark order as completed/delivered',
        inputSchema: {
          type: 'object',
          properties: {
            number: { type: 'string', description: 'Order number' },
            status: { type: 'string', description: 'Completion status' },
            signature: { type: 'string', description: 'Delivery signature' },
            notes: { type: 'string', description: 'Completion notes' },
          },
          required: ['number'],
        },
      },

      {
        name: 'orders_reject_by_number',
        description: 'Mark order as rejected/failed',
        inputSchema: {
          type: 'object',
          properties: {
            number: { type: 'string', description: 'Order number' },
            reasonId: { type: 'number', description: 'Rejection reason ID' },
            reason: { type: 'string', description: 'Rejection reason text' },
            notes: { type: 'string', description: 'Rejection notes' },
          },
          required: ['number'],
        },
      },

      {
        name: 'orders_list_by_date',
        description: 'List orders by date',
        inputSchema: {
          type: 'object',
          properties: {
            date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Date in YYYY-MM-DD format' },
          },
          required: ['date'],
        },
      },

      // Route tools
      {
        name: 'routes_create',
        description: 'Create a new delivery route',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Route code' },
            date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Route date' },
            driver: { type: 'number', description: 'Driver ID' },
            vehicle: { type: 'number', description: 'Vehicle ID' },
          },
          required: ['code', 'date'],
        },
      },

      {
        name: 'routes_get_by_code',
        description: 'Get route by route code',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Route code' },
          },
          required: ['code'],
        },
      },

      {
        name: 'routes_start_by_code',
        description: 'Start route execution',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Route code' },
          },
          required: ['code'],
        },
      },

      {
        name: 'routes_close_by_code',
        description: 'Complete route execution',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Route code' },
          },
          required: ['code'],
        },
      },

      {
        name: 'routes_add_order_by_code',
        description: 'Add existing order to route',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Route code' },
            orderNumber: { type: 'string', description: 'Order number to add' },
            orderId: { type: 'number', description: 'Order ID to add' },
          },
          required: ['code'],
        },
      },

      {
        name: 'routes_get_track_by_code',
        description: 'Get GPS tracking data for route',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Route code' },
          },
          required: ['code'],
        },
      },

      // Driver tools
      {
        name: 'drivers_create',
        description: 'Create a new driver',
        inputSchema: {
          type: 'object',
          properties: {
            username: { type: 'string', description: 'Driver username' },
            name: { type: 'string', description: 'Driver name' },
            phone: { type: 'string', description: 'Phone number' },
            email: { type: 'string', description: 'Email address' },
            active: { type: 'boolean', description: 'Active status' },
          },
          required: ['username', 'name'],
        },
      },

      {
        name: 'drivers_list',
        description: 'List all drivers',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      {
        name: 'drivers_get_by_username',
        description: 'Get driver by username',
        inputSchema: {
          type: 'object',
          properties: {
            username: { type: 'string', description: 'Driver username' },
          },
          required: ['username'],
        },
      },

      {
        name: 'drivers_update',
        description: 'Update driver information',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Driver ID' },
            username: { type: 'string', description: 'Driver username' },
            name: { type: 'string', description: 'Driver name' },
            phone: { type: 'string', description: 'Phone number' },
            email: { type: 'string', description: 'Email address' },
            active: { type: 'boolean', description: 'Active status' },
          },
        },
      },

      // Vehicle tools
      {
        name: 'vehicles_create',
        description: 'Create a new vehicle',
        inputSchema: {
          type: 'object',
          properties: {
            number: { type: 'string', description: 'Vehicle number' },
            type: { type: 'string', description: 'Vehicle type' },
            capacity: { type: 'number', description: 'Vehicle capacity' },
            active: { type: 'boolean', description: 'Active status' },
          },
          required: ['number'],
        },
      },

      {
        name: 'vehicles_list',
        description: 'List all vehicles',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      {
        name: 'reject_reasons_list',
        description: 'List all valid rejection reasons',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  async callTool(name: string, arguments_: any): Promise<any> {
    switch (name) {
      // Test tools
      case 'test_ping':
        return await this.testResource.ping();

      // Order tools
      case 'orders_create':
        return await this.orderResource.create(arguments_);
      case 'orders_update':
        return await this.orderResource.update(arguments_);
      case 'orders_bulk_create':
        return await this.orderResource.bulkCreate(arguments_);
      case 'orders_get_by_number':
        return await this.orderResource.getByNumber(arguments_);
      case 'orders_complete_by_number':
        return await this.orderResource.completeByNumber(arguments_);
      case 'orders_reject_by_number':
        return await this.orderResource.rejectByNumber(arguments_);
      case 'orders_list_by_date':
        return await this.orderResource.listByDate(arguments_);

      // Route tools
      case 'routes_create':
        return await this.routeResource.create(arguments_);
      case 'routes_get_by_code':
        return await this.routeResource.getByCode(arguments_);
      case 'routes_start_by_code':
        return await this.routeResource.startByCode(arguments_);
      case 'routes_close_by_code':
        return await this.routeResource.closeByCode(arguments_);
      case 'routes_add_order_by_code':
        if (arguments_.orderNumber) {
          return await this.routeResource.addExistingOrderByCodeAndNumber(arguments_);
        } else if (arguments_.orderId) {
          return await this.routeResource.addExistingOrderByCodeAndId(arguments_);
        }
        throw new Error('Either orderNumber or orderId must be provided');
      case 'routes_get_track_by_code':
        return await this.routeResource.getTrackByCode(arguments_);

      // Driver tools
      case 'drivers_create':
        return await this.driverResource.create(arguments_);
      case 'drivers_list':
        return await this.driverResource.list();
      case 'drivers_get_by_username':
        return await this.driverResource.getByUsername(arguments_);
      case 'drivers_update':
        return await this.driverResource.update(arguments_);

      // Vehicle tools
      case 'vehicles_create':
        return await this.vehicleResource.create(arguments_);
      case 'vehicles_list':
        return await this.vehicleResource.list();

      // Other tools
      case 'reject_reasons_list':
        return await this.rejectReasonResource.list();

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}