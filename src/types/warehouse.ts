export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type OrderStage = 
  | 'Created'
  | 'Priority Assigned'
  | 'Inventory Checked'
  | 'Stock Allocated'
  | 'Picking'
  | 'Packing'
  | 'Quality Check'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Delivered';

export type ShippingMethod = 'Express Air' | 'Priority Ground' | 'Standard Ground' | 'Freight';

export interface OrderItem {
  sku: string;
  productName: string;
  requestedQty: number;
  allocatedQty: number;
  unitPrice: number;
  zone: string;
  binLocation: string;
}

export interface PriorityFactor {
  name: string;
  scoreContribution: number;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerTier: 'Enterprise VIP' | 'Premium' | 'Standard';
  orderValue: number;
  createdAt: string;
  deliveryDeadline: string;
  deadlineMinutesRemaining: number;
  stage: OrderStage;
  priority: PriorityLevel;
  priorityScore: number; // 0 - 100
  priorityFactors: PriorityFactor[];
  items: OrderItem[];
  shippingMethod: ShippingMethod;
  assignedPickerId?: string;
  assignedPackerId?: string;
  trackingId?: string;
  hasException: boolean;
  exceptionId?: string;
  aiRecommendation?: string;
}

export type StockStatus = 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock' | 'Overstock';

export interface InventoryItem {
  sku: string;
  productName: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  unitCost: number;
  warehouseZone: string;
  binLocation: string;
  supplierId: string;
  supplierName: string;
  status: StockStatus;
  dailyAvgDemand: number;
  estimatedDaysRemaining: number;
  aiForecast: string;
  lastRestockedDate: string;
}

export type ExceptionType = 
  | 'Stock shortage'
  | 'Damaged item'
  | 'Missing item'
  | 'Picking error'
  | 'Inventory mismatch'
  | 'Delayed order'
  | 'Quality failure'
  | 'Dispatch delay';

export type ExceptionStatus = 'Active' | 'Investigating' | 'In Resolution' | 'Resolved' | 'Escalated';

export interface Exception {
  id: string;
  orderId: string;
  sku?: string;
  type: ExceptionType;
  problem: string;
  impact: string;
  priority: PriorityLevel;
  aiAnalysis: string;
  recommendedResolution: string;
  status: ExceptionStatus;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  createdAt: string;
  resolvedAt?: string;
  timeline: {
    timestamp: string;
    action: string;
    author: string;
  }[];
}

export interface WarehouseZone {
  id: string;
  name: string;
  code: string;
  category: string;
  totalBins: number;
  totalItemsCount: number;
  activeWorkersCount: number;
  pendingPicksCount: number;
  congestionLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  efficiencyRate: number; // percentage e.g. 88
  heatmapScore: number; // 0-100 traffic score
}

export type PickingStage = 'Pending' | 'Assigned' | 'Picking' | 'Picked' | 'Verified';

export interface PickRouteStep {
  stepNumber: number;
  location: string; // e.g. "A1-Bin 04"
  sku: string;
  productName: string;
  qtyToPick: number;
}

export interface PickingTask {
  id: string;
  orderId: string;
  pickerId?: string;
  pickerName?: string;
  zone: string;
  stage: PickingStage;
  priority: PriorityLevel;
  route: PickRouteStep[];
  estimatedDistanceMeters: number;
  estimatedTimeSeconds: number;
  routeJustification: string;
  startedAt?: string;
  completedAt?: string;
}

export type PackageStatus = 'Picked' | 'Packing' | 'Weight Check' | 'Label Generated' | 'Ready';

export interface PackingTask {
  id: string;
  orderId: string;
  packerId?: string;
  packerName?: string;
  packageCount: number;
  actualWeightKg: number;
  expectedWeightKg: number;
  dimensionsCm: string; // e.g. "30x20x15"
  shippingMethod: ShippingMethod;
  status: PackageStatus;
  weightMatch: boolean;
  itemCheckPassed: boolean;
}

export type QCStatus = 'Pending QC' | 'Inspecting' | 'Passed' | 'Failed';

export interface QCInspection {
  id: string;
  orderId: string;
  inspectorId?: string;
  inspectorName?: string;
  status: QCStatus;
  checks: {
    correctSku: boolean;
    correctQuantity: boolean;
    productCondition: boolean;
    packagingCondition: boolean;
    labelAccuracy: boolean;
  };
  notes?: string;
}

export type ShipmentStatus = 'Ready' | 'Label Created' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Delayed';

export interface Shipment {
  id: string;
  orderId: string;
  customerName: string;
  courier: 'FedEx Express' | 'DHL Express' | 'UPS Priority' | 'Freight Direct';
  trackingId: string;
  destination: string;
  shippingPriority: PriorityLevel;
  expectedDispatchTime: string;
  actualDispatchTime?: string;
  status: ShipmentStatus;
  delayRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  delayReason?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: 'Allocation' | 'Inventory' | 'Picking' | 'Dispatch' | 'Exception' | 'Capacity';
  impact: 'High' | 'Medium' | 'Low';
  confidenceScore: number; // e.g. 94 for 94%
  actionText: string;
  explanation: string[];
  affectedOrderIds?: string[];
  affectedSkus?: string[];
  applied: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Picker' | 'Packer' | 'QC Inspector' | 'Dispatcher' | 'Warehouse Manager';
  zone: string;
  currentTask?: string;
  productivityScore: number; // e.g. 94%
  status: 'Active' | 'On Break' | 'Assigned' | 'Offline';
  completedTasksToday: number;
  avatarUrl?: string;
  efficiencyRating?: number;
  fatigueLikelihood?: 'High' | 'Medium' | 'Low';
  tasksCompletedToday?: number;
  errorsToday?: number;
  currentZone?: string;
  shiftHours?: string;
}

export interface Supplier {
  id: string;
  name: string;
  productsSupplied: string[];
  leadTimeDays: number;
  reliabilityRate: number; // percentage
  lastOrderDate: string;
  pendingOrdersCount: number;
  performanceScore: number; // 0-100
  aiRecommendation?: string;
  location?: string;
  avgLeadTimeDays?: number;
  reliabilityScore?: number;
  activeSkuCount?: number;
  fillRate?: number;
  lastDelivery?: string;
  deliveryHistory?: boolean[];
  contractType?: string;
  paymentTerms?: string;
}

export interface SimulationStep {
  stepIndex: number;
  title: string;
  description: string;
  detail: string;
  timestamp: string;
  affectedEntity: string;
  type: 'order' | 'inventory' | 'pick' | 'pack' | 'qc' | 'dispatch' | 'ai';
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  impactSummary: string;
  affectedOrderCount: number;
  stockRiskLevel: 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  expectedResult: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkView?: string;
}

export interface PickerLocationTrack {
  pickerId: string;
  pickerName: string;
  orderId: string;
  currentZone: string;
  currentX: number; // 0-100 percentage on floorplan
  currentY: number; // 0-100 percentage on floorplan
  speedMps: number;
  stepsRemaining: number;
  totalDistanceMeters: number;
  remainingDistanceMeters: number;
  waypoints: { x: number; y: number; label: string; sku?: string; completed: boolean }[];
  turnByTurn: string[];
}

export interface CarrierGpsTrack {
  shipmentId: string;
  orderId: string;
  courier: string;
  trackingNumber: string;
  driverName: string;
  vehicleType: string;
  lat: number;
  lng: number;
  speedKmh: number;
  origin: string;
  destination: string;
  etaMinutes: number;
  checkpoints: { name: string; timestamp: string; completed: boolean; lat: number; lng: number }[];
  weatherAlert?: string;
}
