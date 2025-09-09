// Base types for Track-POD API

export interface Address {
  name?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Driver {
  id?: number;
  username: string;
  name: string;
  phone?: string;
  email?: string;
  vehicle?: number;
  depot?: string;
  active: boolean;
}

export interface Vehicle {
  id?: number;
  number: string;
  type?: string;
  capacity?: number;
  active: boolean;
}

export interface OrderItem {
  name: string;
  quantity: number;
  weight?: number;
  value?: number;
  barcode?: string;
}

export interface Consignee {
  name: string;
  phone?: string;
  email?: string;
}

export interface Order {
  id?: number;
  number: string;
  trackId?: string;
  consignee: Consignee;
  address: Address;
  items: OrderItem[];
  status?: string;
  route?: string | number;
  deliveryDate?: string;
  timeWindow?: {
    from?: string;
    to?: string;
  };
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Route {
  id?: number;
  code: string;
  date: string;
  driver?: Driver | number;
  vehicle?: Vehicle | number;
  orders?: Order[];
  status?: 'planned' | 'started' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  totalDistance?: number;
  totalDuration?: number;
}

export interface VehicleCheck {
  id?: number;
  vehicleNumber: string;
  date: string;
  checkType: string;
  results: Record<string, unknown>;
}

export interface RejectReason {
  id: number;
  name: string;
  description?: string;
}

export interface GPSTrack {
  routeCode: string;
  points: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    speed?: number;
    heading?: number;
  }>;
}

export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// MCP Response wrapper
export interface MCPResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: string;
    correlationId?: string;
  };
}