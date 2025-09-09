# Track-POD MCP Integration – Product Requirements Document

## 1. Executive Summary

This PRD defines the requirements for building a Model Context Protocol (MCP) server that integrates with Track-POD's REST API. The integration will enable AI agents and internal applications to perform logistics operations through structured method calls, abstracting the complexity of HTTP requests while providing a consistent, type-safe interface.

## 2. Introduction

### 2.1 Purpose
Create an MCP-compliant tool that wraps Track-POD's REST API endpoints, enabling AI agents and internal applications to perform logistics operations (scheduling orders, assigning drivers, managing routes) via structured method calls. The tool abstracts underlying HTTP requests and provides a consistent, type-safe interface.

### 2.2 Scope
The MCP integration covers these Track-POD API domains:
- **Address** – Create/update address entities
- **Driver** – CRUD operations for driver management
- **Order** – Comprehensive order lifecycle management
- **RejectReason** – Retrieve valid rejection reasons
- **Route** – Full route management including creation, updates, and tracking
- **Test** – Health check and rate limit verification
- **Vehicle** – Fleet vehicle management
- **VehicleCheck** – Vehicle inspection report queries

### 2.3 API Base URL and Authentication
- Base URL: `https://api.track-pod.com`
- Authentication: X-API-KEY header (obtained from Track-POD dashboard)
- Content-Type: application/json (default)
- Rate Limits: ~20 requests/second, 400 requests/minute

## 3. Objectives and Goals

1. **Expose Track-POD API through MCP** – Clear mapping of REST endpoints to MCP methods
2. **Simplify Authentication** – Automatic X-API-KEY header injection
3. **Enforce Rate Limits** – Client-side throttling to respect API limits
4. **Handle Errors Gracefully** – Meaningful error messages with retry logic for 5xx errors
5. **Support Data Transformation** – Convert between MCP and Track-POD JSON schemas
6. **Document Usage** – Auto-generate documentation with examples
7. **Ensure Security** – Secure API key storage with optional IP whitelisting
8. **Be Extensible** – Easy addition of new endpoints as API evolves

## 4. Functional Requirements

### 4.1 Authentication Requirements
- **FR-AUTH-1**: Accept API key via environment variable or MCP configuration
- **FR-AUTH-2**: Include X-API-KEY in all request headers
- **FR-AUTH-3**: Set Content-Type: application/json and Accept: application/json by default

### 4.2 Address Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `addresses.createOrUpdate` | Add or update an address | POST /Address |

### 4.3 Driver Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `drivers.getById` | Get driver by ID | GET /Driver/Id/{id} |
| `drivers.deleteById` | Delete driver by ID | DELETE /Driver/Id/{id} |
| `drivers.getByUsername` | Get driver by username | GET /Driver/Username/{username} |
| `drivers.deleteByUsername` | Delete driver by username | DELETE /Driver/Username/{username} |
| `drivers.list` | List all drivers | GET /Driver |
| `drivers.create` | Add new driver | POST /Driver |
| `drivers.update` | Update driver info | PUT /Driver |

### 4.4 Order Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `orders.create` | Add unscheduled order | POST /Order |
| `orders.update` | Update existing order | PUT /Order |
| `orders.bulkCreate` | Create up to 500 orders | POST /Order/Bulk |
| `orders.getByNumber` | Get order by number | GET /Order/Number/{number} |
| `orders.deleteByNumber` | Delete order by number | DELETE /Order/Number/{number} |
| `orders.getById` | Get order by ID | GET /Order/Id/{id} |
| `orders.deleteById` | Delete order by ID | DELETE /Order/Id/{id} |
| `orders.getByTrackId` | Get order by tracking ID | GET /Order/TrackId/{trackId} |
| `orders.updateByTrackId` | Update order by tracking ID | PUT /Order/TrackId/{trackId} |
| `orders.listByDate` | List orders by date | GET /Order/Date/{date} |
| `orders.listByRouteDate` | Get orders by route date | GET /Order/Route/Date/{date} |
| `orders.listByRouteCode` | Get orders by route code | GET /Order/Route/Code/{code} |
| `orders.listStatusAfterDate` | Get orders modified after date | GET /Order/Status/Date/{date} |
| `orders.listRecentByNumber` | Get 25 most recent orders | GET /Order/Number/{number}/List |
| `orders.downloadPodByNumber` | Get POD document | GET /Order/Number/{number}/Pdf |
| `orders.downloadPodById` | Get POD by ID | GET /Order/Id/{id}/Pdf |
| `orders.getShippingLabelByNumber` | Get shipping label | GET /Order/Number/{number}/Shipping-label |
| `orders.getShippingLabelById` | Get shipping label by ID | GET /Order/Id/{id}/Shipping-label |
| `orders.completeByNumber` | Mark order delivered/collected | PUT /Order/Number/{number}/Complete |
| `orders.completeById` | Mark order complete by ID | PUT /Order/Id/{id}/Complete |
| `orders.completeByTrackId` | Mark order complete by track ID | PUT /Order/TrackId/{trackId}/Complete |
| `orders.rejectByNumber` | Mark order not delivered | PUT /Order/Number/{number}/Reject |
| `orders.rejectById` | Mark order rejected by ID | PUT /Order/Id/{id}/Reject |
| `orders.rejectByTrackId` | Mark order rejected by track ID | PUT /Order/TrackId/{trackId}/Reject |

**Note**: Deprecated status endpoints (/Order/*/Status) must be excluded or raise warnings.

### 4.5 RejectReason Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `rejectReasons.list` | Get valid rejection reasons | GET /RejectReason |

### 4.6 Route Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `routes.create` | Create new route | POST /Route |
| `routes.updateByCode` | Update route by code | PUT /Route/Code/{code} |
| `routes.getByCode` | Get route by code | GET /Route/Code/{code} |
| `routes.deleteByCode` | Delete route by code | DELETE /Route/Code/{code} |
| `routes.updateById` | Update route by ID | PUT /Route/Id/{id} |
| `routes.getById` | Get route by ID | GET /Route/Id/{id} |
| `routes.deleteById` | Delete route by ID | DELETE /Route/Id/{id} |
| `routes.listByDate` | List routes by date | GET /Route/Date/{date} |
| `routes.listToExportByCode` | Get unexported route codes | GET /Route/Export/Code |
| `routes.listToExportById` | Get unexported route IDs | GET /Route/Export/Id |
| `routes.confirmExportByCode` | Mark route as exported | PUT /Route/Export/Code/{code} |
| `routes.confirmExportById` | Mark route exported by ID | PUT /Route/Export/Id/{id} |
| `routes.addNewOrderByCode` | Add new order to route | PUT /Route/Code/{code}/Order |
| `routes.addNewOrderById` | Add new order by route ID | PUT /Route/Id/{id}/Order |
| `routes.addExistingOrderByCodeAndNumber` | Add existing order to route | PUT /Route/Code/{code}/Order/Number/{number} |
| `routes.addExistingOrderByCodeAndId` | Add order by IDs | PUT /Route/Code/{code}/Order/Id/{orderId} |
| `routes.addExistingOrderByIdAndNumber` | Add order to route by ID | PUT /Route/Id/{id}/Order/Number/{number} |
| `routes.addExistingOrderByIdAndId` | Add order by both IDs | PUT /Route/Id/{id}/Order/Id/{orderId} |
| `routes.getTrackByCode` | Get GPS track by code | GET /Route/Track/Code/{code} |
| `routes.getTrackById` | Get GPS track by ID | GET /Route/Track/Id/{id} |
| `routes.startByCode` | Start route by code | PUT /Route/Start/Code/{code} |
| `routes.startById` | Start route by ID | PUT /Route/Start/Id/{id} |
| `routes.closeByCode` | Close route by code | PUT /Route/Close/Code/{code} |
| `routes.closeById` | Close route by ID | PUT /Route/Close/Id/{id} |

### 4.7 Test Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `test.ping` | Verify API key and rate limits | GET /Test |

### 4.8 Vehicle Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `vehicles.getById` | Get vehicle by ID | GET /Vehicle/{id} |
| `vehicles.deleteById` | Delete vehicle by ID | DELETE /Vehicle/{id} |
| `vehicles.list` | List all vehicles | GET /Vehicle |
| `vehicles.create` | Add new vehicle | POST /Vehicle |
| `vehicles.update` | Update vehicle info | PUT /Vehicle |

### 4.9 VehicleCheck Methods
| Method | Description | Endpoint |
|--------|-------------|----------|
| `vehicleChecks.getLastByNumber` | Get last check by number | GET /VehicleCheck/{number} |
| `vehicleChecks.getByNumberAndDate` | Get checks by number/date | GET /VehicleCheck/Number/{number}/Date/{date} |
| `vehicleChecks.listByDate` | Get checks by date | GET /VehicleCheck/Date/{date} |

## 5. Non-Functional Requirements

### 5.1 Performance & Reliability
- **NFR-RATE-LIMIT**: Implement client-side throttling (20 req/sec, 400 req/min)
- **NFR-TIMEOUT**: 10-second request timeout with configurable retries on 5xx errors
- **NFR-RETRY**: Exponential backoff on rate limit (429) responses

### 5.2 Security
- **NFR-SECURITY-1**: Store API key in environment variables or secrets manager
- **NFR-SECURITY-2**: Never log API keys
- **NFR-SECURITY-3**: Support optional IP whitelisting configuration

### 5.3 Data Handling
- **NFR-VALIDATION**: Validate required fields against Track-POD schemas
- **NFR-DATE-FORMAT**: Convert dates to ISO-8601 format
- **NFR-UTC**: Handle all timestamps as UTC

### 5.4 Documentation & Extensibility
- **NFR-DOCS**: Auto-generate method documentation from schemas
- **NFR-DEPRECATION**: Flag deprecated endpoints with warnings
- **NFR-EXTENSIBILITY**: Abstract HTTP client for easy endpoint additions

### 5.5 MCP Compliance
- **NFR-NAMESPACES**: Use resource-based namespacing (e.g., `orders.create`)
- **NFR-ERROR-HANDLING**: Return structured MCP error responses
- **NFR-TYPING**: Provide TypeScript definitions for all methods

## 6. Technical Architecture

### 6.1 MCP Server Structure
```
track-pod-mcp/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── client/
│   │   ├── base.ts        # Base HTTP client with auth
│   │   └── rate-limiter.ts # Rate limiting logic
│   ├── resources/
│   │   ├── address.ts
│   │   ├── driver.ts
│   │   ├── order.ts
│   │   ├── route.ts
│   │   ├── vehicle.ts
│   │   └── ...
│   ├── schemas/           # TypeScript interfaces
│   └── utils/
├── package.json
└── mcp.json               # MCP manifest
```

### 6.2 Configuration Schema
```json
{
  "name": "track-pod-mcp",
  "version": "1.0.0",
  "description": "Track-POD API integration for MCP",
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "env": "TRACKPOD_API_KEY"
    },
    "baseUrl": {
      "type": "string",
      "default": "https://api.track-pod.com"
    },
    "rateLimit": {
      "requestsPerSecond": 20,
      "requestsPerMinute": 400
    },
    "timeout": {
      "type": "number",
      "default": 10000
    }
  }
}
```

## 7. Error Handling Strategy

### 7.1 HTTP Status Code Mapping
| HTTP Code | MCP Error Type | Description |
|-----------|---------------|-------------|
| 400 | ValidationError | Invalid input parameters |
| 401 | AuthenticationError | Invalid or missing API key |
| 403 | AuthorizationError | Insufficient permissions |
| 404 | ResourceNotFound | Resource doesn't exist |
| 409 | ConflictError | Invalid state transition |
| 429 | RateLimitError | Rate limit exceeded |
| 5xx | ServerError | Track-POD service error |

### 7.2 Retry Strategy
- 5xx errors: Retry with exponential backoff (max 3 attempts)
- 429 errors: Back off and retry after rate limit window
- 4xx errors: No retry, return error immediately

## 8. Data Schemas

### 8.1 Core Objects
- **Address**: name, street, city, postalCode, country, coordinates
- **Driver**: id, username, name, phone, vehicle, depot, active
- **Order**: number, trackId, consignee, address, items, status, route
- **Route**: code, id, date, driver, vehicle, orders, status
- **Vehicle**: id, number, type, capacity, active

### 8.2 Response Format
All MCP responses follow this structure:
```typescript
interface MCPResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
  };
}
```

## 9. Testing Requirements

### 9.1 Unit Tests
- Test each resource method independently
- Mock HTTP responses
- Validate parameter transformation
- Test error handling scenarios

### 9.2 Integration Tests
- Test against Track-POD sandbox environment
- Verify rate limiting behavior
- Test bulk operations
- Validate webhook callbacks

### 9.3 Performance Tests
- Verify rate limit compliance
- Test timeout handling
- Measure response times
- Test concurrent request handling

## 10. Acceptance Criteria

- **AC-1**: All listed methods are implemented and accessible via MCP
- **AC-2**: Authentication works with valid API keys
- **AC-3**: Rate limits are respected without triggering 429 errors
- **AC-4**: Invalid payloads are rejected with clear error messages
- **AC-5**: Deprecated endpoints emit appropriate warnings
- **AC-6**: Documentation is auto-generated for all methods
- **AC-7**: Date/time handling works correctly with UTC conversion
- **AC-8**: Bulk operations handle up to 500 items successfully
- **AC-9**: Error responses follow MCP error format
- **AC-10**: TypeScript definitions are available for all methods

## 11. Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- Base HTTP client with authentication
- Rate limiting implementation
- Error handling framework
- MCP server setup

### Phase 2: Essential Resources (Week 2)
- Order management methods
- Route management methods
- Driver management methods
- Basic testing suite

### Phase 3: Complete Feature Set (Week 3)
- Vehicle and VehicleCheck methods
- Address methods
- RejectReason methods
- Bulk operations optimization

### Phase 4: Polish & Documentation (Week 4)
- Complete documentation
- Performance optimization
- Integration testing
- TypeScript definitions

## 12. Future Enhancements

1. **Webhook Support** – MCP event subscriptions for real-time updates
2. **Caching Layer** – Intelligent caching for frequently accessed data
3. **Batch Operations** – Optimized bulk processing beyond current limits
4. **Analytics Integration** – Performance metrics and usage analytics
5. **Geofencing Support** – Location-based triggers and alerts
6. **Multi-tenant Support** – Handle multiple Track-POD accounts
7. **Offline Queue** – Queue operations when API is unavailable
8. **AI Optimization** – Route optimization suggestions using AI

## 13. Dependencies

### External Dependencies
- Track-POD API (v2.0)
- MCP SDK (@modelcontextprotocol/sdk)
- HTTP client library (axios or fetch)
- Rate limiting library (bottleneck or p-limit)
- Date handling (date-fns or dayjs)

### Development Dependencies
- TypeScript
- Jest (testing)
- ESLint/Prettier (code quality)
- Nodemon (development)

## 14. Security Considerations

1. **API Key Management**
   - Never commit API keys to version control
   - Use environment variables or secure vaults
   - Rotate keys regularly

2. **Data Privacy**
   - Encrypt sensitive data in transit
   - Log only non-sensitive information
   - Implement data retention policies

3. **Access Control**
   - Implement method-level permissions
   - Support IP whitelisting
   - Audit log all operations

## 15. Monitoring & Observability

### Metrics to Track
- Request rate and throttling events
- Error rates by type
- Response times by endpoint
- Success/failure ratios
- Resource utilization

### Logging Strategy
- Structured JSON logging
- Correlation IDs for request tracing
- Error stack traces (sanitized)
- Performance metrics

## 16. Support & Maintenance

### Documentation Requirements
- API reference with examples
- Setup and configuration guide
- Troubleshooting guide
- Migration guides for updates

### Support Channels
- GitHub issues for bug reports
- Documentation wiki
- Example implementations
- Community Discord/Slack

## Appendix A: Sample MCP Method Calls

### Creating an Order
```typescript
await mcp.call('orders.create', {
  number: 'ORD-2024-001',
  consignee: {
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com'
  },
  address: {
    street: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'US'
  },
  items: [
    {
      name: 'Product A',
      quantity: 2,
      weight: 5.5
    }
  ]
});
```

### Starting a Route
```typescript
await mcp.call('routes.startByCode', {
  code: 'ROUTE-2024-01-15-001'
});
```

### Completing an Order
```typescript
await mcp.call('orders.completeByNumber', {
  number: 'ORD-2024-001',
  status: 'delivered',
  signature: 'base64_signature_data',
  notes: 'Delivered to reception'
});
```

## Appendix B: Webhook Event Types

- `order.created`
- `order.updated`
- `order.deleted`
- `order.status_changed`
- `route.created`
- `route.updated`
- `route.started`
- `route.closed`
- `pod.ready`

## Appendix C: Rate Limiting Guidelines

### Implementation Strategy
1. Use token bucket algorithm
2. Track requests per API key
3. Implement sliding window for per-minute limits
4. Queue requests when approaching limits
5. Return clear error messages when limits exceeded

### Best Practices
- Batch operations where possible
- Cache frequently accessed data
- Implement request coalescing
- Use webhook events instead of polling
- Monitor rate limit headers in responses

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation