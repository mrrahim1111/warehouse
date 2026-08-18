import type {
  InventoryItem,
  Order,
  Employee,
  WarehouseZone,
  Supplier,
  Shipment,
  Exception,
  AIRecommendation,
  PickingTask,
  PackingTask,
  QCInspection,
  WhatIfScenario,
  NotificationItem,
  PickerLocationTrack,
  CarrierGpsTrack
} from '../types/warehouse';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    sku: 'SKU-1001',
    productName: 'Industrial Micro-Sensor Hub V4',
    category: 'Electronics & Sensors',
    currentStock: 7,
    reservedStock: 7,
    availableStock: 0,
    reorderLevel: 25,
    reorderQuantity: 100,
    unitCost: 184.50,
    warehouseZone: 'Zone A',
    binLocation: 'A1-Bin 04',
    supplierId: 'SUP-01',
    supplierName: 'AeroTech Components Ltd',
    status: 'Critical',
    dailyAvgDemand: 18,
    estimatedDaysRemaining: 0.4,
    aiForecast: 'High stockout risk in 10h. Immediate reorder recommended.',
    lastRestockedDate: '2026-08-10'
  },
  {
    sku: 'SKU-1002',
    productName: 'Heavy-Duty Pneumatic Actuator',
    category: 'Industrial Machinery',
    currentStock: 48,
    reservedStock: 12,
    availableStock: 36,
    reorderLevel: 20,
    reorderQuantity: 50,
    unitCost: 320.00,
    warehouseZone: 'Zone B',
    binLocation: 'B2-Bin 12',
    supplierId: 'SUP-02',
    supplierName: 'Global Heavy Parts Inc',
    status: 'Healthy',
    dailyAvgDemand: 8,
    estimatedDaysRemaining: 4.5,
    aiForecast: 'Demand stable. Optimal stock levels maintained.',
    lastRestockedDate: '2026-08-14'
  },
  {
    sku: 'SKU-1003',
    productName: 'Fiber Optic Transceiver Module 100G',
    category: 'Telecommunications',
    currentStock: 14,
    reservedStock: 10,
    availableStock: 4,
    reorderLevel: 30,
    reorderQuantity: 120,
    unitCost: 95.00,
    warehouseZone: 'Zone A',
    binLocation: 'A3-Bin 08',
    supplierId: 'SUP-03',
    supplierName: 'OptiWave Networks',
    status: 'Low Stock',
    dailyAvgDemand: 12,
    estimatedDaysRemaining: 0.3,
    aiForecast: 'Reorder triggered automatically. Supplier lead time 2 days.',
    lastRestockedDate: '2026-08-08'
  },
  {
    sku: 'SKU-1004',
    productName: 'Lithium Iron Phosphate Battery Pack 48V',
    category: 'Energy Storage',
    currentStock: 85,
    reservedStock: 20,
    availableStock: 65,
    reorderLevel: 15,
    reorderQuantity: 40,
    unitCost: 450.00,
    warehouseZone: 'Zone C',
    binLocation: 'C1-Bin 02',
    supplierId: 'SUP-04',
    supplierName: 'VoltTech Energy Corp',
    status: 'Healthy',
    dailyAvgDemand: 5,
    estimatedDaysRemaining: 13.0,
    aiForecast: 'Stock healthy. Next reorder expected in 10 days.',
    lastRestockedDate: '2026-08-12'
  },
  {
    sku: 'SKU-1005',
    productName: 'Precision Hydraulic Valve Assembly',
    category: 'Industrial Machinery',
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    reorderLevel: 10,
    reorderQuantity: 30,
    unitCost: 210.00,
    warehouseZone: 'Zone B',
    binLocation: 'B5-Bin 18',
    supplierId: 'SUP-02',
    supplierName: 'Global Heavy Parts Inc',
    status: 'Out of Stock',
    dailyAvgDemand: 6,
    estimatedDaysRemaining: 0,
    aiForecast: 'STOCKOUT DETECTED! 3 backorders waiting allocation.',
    lastRestockedDate: '2026-07-28'
  },
  {
    sku: 'SKU-1006',
    productName: 'Smart Temperature Transmitter Module',
    category: 'Electronics & Sensors',
    currentStock: 120,
    reservedStock: 15,
    availableStock: 105,
    reorderLevel: 40,
    reorderQuantity: 80,
    unitCost: 78.00,
    warehouseZone: 'Zone A',
    binLocation: 'A2-Bin 10',
    supplierId: 'SUP-01',
    supplierName: 'AeroTech Components Ltd',
    status: 'Healthy',
    dailyAvgDemand: 10,
    estimatedDaysRemaining: 10.5,
    aiForecast: 'Stock high. Promotional volume absorption predicted.',
    lastRestockedDate: '2026-08-15'
  },
  {
    sku: 'SKU-1007',
    productName: 'High-Torque Servo Motor 2.5kW',
    category: 'Robotics',
    currentStock: 18,
    reservedStock: 14,
    availableStock: 4,
    reorderLevel: 25,
    reorderQuantity: 50,
    unitCost: 620.00,
    warehouseZone: 'Zone D',
    binLocation: 'D1-Bin 05',
    supplierId: 'SUP-05',
    supplierName: 'RoboMotion Systems',
    status: 'Low Stock',
    dailyAvgDemand: 7,
    estimatedDaysRemaining: 0.6,
    aiForecast: 'High priority allocation active for robotics line.',
    lastRestockedDate: '2026-08-09'
  },
  {
    sku: 'SKU-1008',
    productName: 'Stainless Steel Pressure Gauge 0-100 BAR',
    category: 'Instrumentation',
    currentStock: 210,
    reservedStock: 30,
    availableStock: 180,
    reorderLevel: 50,
    reorderQuantity: 200,
    unitCost: 35.00,
    warehouseZone: 'Zone C',
    binLocation: 'C3-Bin 22',
    supplierId: 'SUP-06',
    supplierName: 'Apex Precision Instruments',
    status: 'Overstock',
    dailyAvgDemand: 12,
    estimatedDaysRemaining: 15.0,
    aiForecast: 'Inventory exceeds target by 28%. Slow moving alert.',
    lastRestockedDate: '2026-08-02'
  },
  {
    sku: 'SKU-1009',
    productName: 'Rugged RFID Industrial Scanner Unit',
    category: 'Electronics & Sensors',
    currentStock: 9,
    reservedStock: 8,
    availableStock: 1,
    reorderLevel: 20,
    reorderQuantity: 60,
    unitCost: 480.00,
    warehouseZone: 'Zone A',
    binLocation: 'A4-Bin 14',
    supplierId: 'SUP-01',
    supplierName: 'AeroTech Components Ltd',
    status: 'Critical',
    dailyAvgDemand: 5,
    estimatedDaysRemaining: 0.2,
    aiForecast: 'Impending stockout within 6 hours. Emergency PO recommended.',
    lastRestockedDate: '2026-08-07'
  },
  {
    sku: 'SKU-1010',
    productName: 'Automated Conveyor Roller Drive Belt',
    category: 'Conveyor Parts',
    currentStock: 140,
    reservedStock: 45,
    availableStock: 95,
    reorderLevel: 40,
    reorderQuantity: 100,
    unitCost: 28.50,
    warehouseZone: 'Zone B',
    binLocation: 'B1-Bin 03',
    supplierId: 'SUP-07',
    supplierName: 'FlexiDrive Logistics Hardware',
    status: 'Healthy',
    dailyAvgDemand: 15,
    estimatedDaysRemaining: 6.3,
    aiForecast: 'Demand steady across regional distribution hubs.',
    lastRestockedDate: '2026-08-11'
  },
  {
    sku: 'SKU-1011',
    productName: 'Industrial PLC Controller Mainboard',
    category: 'Electronics & Sensors',
    currentStock: 32,
    reservedStock: 10,
    availableStock: 22,
    reorderLevel: 15,
    reorderQuantity: 40,
    unitCost: 890.00,
    warehouseZone: 'Zone A',
    binLocation: 'A1-Bin 19',
    supplierId: 'SUP-03',
    supplierName: 'OptiWave Networks',
    status: 'Healthy',
    dailyAvgDemand: 4,
    estimatedDaysRemaining: 5.5,
    aiForecast: 'High margin SKU. Buffer stock verified.',
    lastRestockedDate: '2026-08-13'
  },
  {
    sku: 'SKU-1012',
    productName: 'High-Temperature Thermal Insulation Wrap',
    category: 'Safety & Materials',
    currentStock: 75,
    reservedStock: 15,
    availableStock: 60,
    reorderLevel: 35,
    reorderQuantity: 150,
    unitCost: 42.00,
    warehouseZone: 'Zone D',
    binLocation: 'D3-Bin 09',
    supplierId: 'SUP-08',
    supplierName: 'ThermoShield Materials',
    status: 'Healthy',
    dailyAvgDemand: 8,
    estimatedDaysRemaining: 7.5,
    aiForecast: 'Normal consumption pattern detected.',
    lastRestockedDate: '2026-08-06'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    customerName: 'Tesla Gigafactory Operations',
    customerTier: 'Enterprise VIP',
    orderValue: 14250.00,
    createdAt: '2026-08-18T10:15:00Z',
    deliveryDeadline: '2026-08-18T14:00:00Z',
    deadlineMinutesRemaining: 45,
    stage: 'Inventory Checked',
    priority: 'Critical',
    priorityScore: 94,
    priorityFactors: [
      { name: 'Delivery Deadline', scoreContribution: 35, description: 'Less than 1 hour to promised dispatch window' },
      { name: 'Customer VIP Status', scoreContribution: 25, description: 'Enterprise VIP account SLA tier' },
      { name: 'Order Value', scoreContribution: 18, description: 'High-value order ($14.2k)' },
      { name: 'Express Shipping', scoreContribution: 16, description: 'Guaranteed Same-Day Air Freight' }
    ],
    items: [
      {
        sku: 'SKU-1001',
        productName: 'Industrial Micro-Sensor Hub V4',
        requestedQty: 10,
        allocatedQty: 7, // 3 unit shortage! Hero scenario
        unitPrice: 184.50,
        zone: 'Zone A',
        binLocation: 'A1-Bin 04'
      },
      {
        sku: 'SKU-1006',
        productName: 'Smart Temperature Transmitter Module',
        requestedQty: 5,
        allocatedQty: 5,
        unitPrice: 78.00,
        zone: 'Zone A',
        binLocation: 'A2-Bin 10'
      }
    ],
    shippingMethod: 'Express Air',
    hasException: true,
    exceptionId: 'EXP-801',
    aiRecommendation: 'Allocate 7 units to ORD-1042 immediately due to critical SLA. Create 3-unit shortage exception & trigger emergency vendor PO.'
  },
  {
    id: 'ORD-1051',
    customerName: 'General Motors Automated Assembly',
    customerTier: 'Premium',
    orderValue: 4120.00,
    createdAt: '2026-08-18T10:45:00Z',
    deliveryDeadline: '2026-08-18T18:00:00Z',
    deadlineMinutesRemaining: 340,
    stage: 'Created',
    priority: 'Medium',
    priorityScore: 68,
    priorityFactors: [
      { name: 'Customer Tier', scoreContribution: 20, description: 'Premium tier account' },
      { name: 'Delivery Window', scoreContribution: 25, description: '5+ hours remaining' },
      { name: 'Stock Availability', scoreContribution: 23, description: 'Waiting for SKU-1001 stock allocation' }
    ],
    items: [
      {
        sku: 'SKU-1001',
        productName: 'Industrial Micro-Sensor Hub V4',
        requestedQty: 5,
        allocatedQty: 0,
        unitPrice: 184.50,
        zone: 'Zone A',
        binLocation: 'A1-Bin 04'
      }
    ],
    shippingMethod: 'Priority Ground',
    hasException: false,
    aiRecommendation: 'Hold allocation until urgent ORD-1042 dispatch complete or incoming replenishment arrives.'
  },
  {
    id: 'ORD-1038',
    customerName: 'Siemens Energy Division',
    customerTier: 'Enterprise VIP',
    orderValue: 28900.00,
    createdAt: '2026-08-18T08:30:00Z',
    deliveryDeadline: '2026-08-18T13:30:00Z',
    deadlineMinutesRemaining: 15,
    stage: 'Picking',
    priority: 'Critical',
    priorityScore: 96,
    priorityFactors: [
      { name: 'SLA Breach Risk', scoreContribution: 40, description: '15 minutes until deadline' },
      { name: 'Enterprise Tier', scoreContribution: 30, description: 'Tier 1 Account' },
      { name: 'High Value', scoreContribution: 26, description: '$28.9k total value' }
    ],
    items: [
      {
        sku: 'SKU-1004',
        productName: 'Lithium Iron Phosphate Battery Pack 48V',
        requestedQty: 4,
        allocatedQty: 4,
        unitPrice: 450.00,
        zone: 'Zone C',
        binLocation: 'C1-Bin 02'
      },
      {
        sku: 'SKU-1011',
        productName: 'Industrial PLC Controller Mainboard',
        requestedQty: 2,
        allocatedQty: 2,
        unitPrice: 890.00,
        zone: 'Zone A',
        binLocation: 'A1-Bin 19'
      }
    ],
    shippingMethod: 'Express Air',
    assignedPickerId: 'EMP-01',
    hasException: false,
    aiRecommendation: 'Accelerate picking via optimized Zone C -> Zone A route. Fast-track directly to Packing Desk 2.'
  },
  {
    id: 'ORD-1039',
    customerName: 'Boeing Defense Systems',
    customerTier: 'Enterprise VIP',
    orderValue: 19400.00,
    createdAt: '2026-08-18T09:00:00Z',
    deliveryDeadline: '2026-08-18T15:00:00Z',
    deadlineMinutesRemaining: 105,
    stage: 'Packing',
    priority: 'High',
    priorityScore: 88,
    priorityFactors: [
      { name: 'VIP Priority', scoreContribution: 30, description: 'Aerospace SLA agreement' },
      { name: 'Item Complexity', scoreContribution: 28, description: 'Dual-box hazmat packaging required' },
      { name: 'Value', scoreContribution: 30, description: 'High value' }
    ],
    items: [
      {
        sku: 'SKU-1002',
        productName: 'Heavy-Duty Pneumatic Actuator',
        requestedQty: 6,
        allocatedQty: 6,
        unitPrice: 320.00,
        zone: 'Zone B',
        binLocation: 'B2-Bin 12'
      }
    ],
    shippingMethod: 'Express Air',
    assignedPackerId: 'EMP-04',
    hasException: false,
    aiRecommendation: 'Packing weight verified. Ready for automated box label scan.'
  },
  {
    id: 'ORD-1040',
    customerName: 'Bosch Mobility Robotics',
    customerTier: 'Premium',
    orderValue: 8750.00,
    createdAt: '2026-08-18T09:15:00Z',
    deliveryDeadline: '2026-08-18T16:00:00Z',
    deadlineMinutesRemaining: 165,
    stage: 'Quality Check',
    priority: 'High',
    priorityScore: 82,
    priorityFactors: [
      { name: 'Quality Strictness', scoreContribution: 35, description: 'Robotics precision tolerance inspection' },
      { name: 'Deadline', scoreContribution: 25, description: '2.5h dispatch buffer' }
    ],
    items: [
      {
        sku: 'SKU-1007',
        productName: 'High-Torque Servo Motor 2.5kW',
        requestedQty: 3,
        allocatedQty: 3,
        unitPrice: 620.00,
        zone: 'Zone D',
        binLocation: 'D1-Bin 05'
      }
    ],
    shippingMethod: 'Priority Ground',
    hasException: false,
    aiRecommendation: 'Complete visual housing inspection for Servo Motor. Proceed to Dispatch Station B.'
  },
  {
    id: 'ORD-1045',
    customerName: 'Honeywell Industrial Controls',
    customerTier: 'Standard',
    orderValue: 1250.00,
    createdAt: '2026-08-18T10:00:00Z',
    deliveryDeadline: '2026-08-18T17:00:00Z',
    deadlineMinutesRemaining: 225,
    stage: 'Ready for Dispatch',
    priority: 'Medium',
    priorityScore: 62,
    priorityFactors: [
      { name: 'Standard Delivery', scoreContribution: 30, description: 'Ground courier scheduled at 15:30' }
    ],
    items: [
      {
        sku: 'SKU-1008',
        productName: 'Stainless Steel Pressure Gauge 0-100 BAR',
        requestedQty: 10,
        allocatedQty: 10,
        unitPrice: 35.00,
        zone: 'Zone C',
        binLocation: 'C3-Bin 22'
      }
    ],
    shippingMethod: 'Standard Ground',
    trackingId: 'TRK-DHL-99214',
    hasException: false,
    aiRecommendation: 'Staged at Bay 4. Awaiting scheduled 15:30 DHL pickup.'
  },
  {
    id: 'ORD-1035',
    customerName: 'ABB Automation Tech',
    customerTier: 'Enterprise VIP',
    orderValue: 34100.00,
    createdAt: '2026-08-18T07:45:00Z',
    deliveryDeadline: '2026-08-18T12:00:00Z',
    deadlineMinutesRemaining: -75, // Missed target!
    stage: 'Ready for Dispatch',
    priority: 'Critical',
    priorityScore: 98,
    priorityFactors: [
      { name: 'DELAY RISK', scoreContribution: 50, description: 'Dispatch window delayed by 75 mins!' },
      { name: 'VIP SLA', scoreContribution: 30, description: 'Penalty risk $500/hr' }
    ],
    items: [
      {
        sku: 'SKU-1003',
        productName: 'Fiber Optic Transceiver Module 100G',
        requestedQty: 8,
        allocatedQty: 8,
        unitPrice: 95.00,
        zone: 'Zone A',
        binLocation: 'A3-Bin 08'
      }
    ],
    shippingMethod: 'Express Air',
    trackingId: 'TRK-FDX-10293',
    hasException: true,
    exceptionId: 'EXP-803',
    aiRecommendation: 'DELAY DETECTED! Re-assign to Courier Hot-Shot Express Van immediately.'
  },
  {
    id: 'ORD-1048',
    customerName: 'Schneider Electric Labs',
    customerTier: 'Premium',
    orderValue: 5600.00,
    createdAt: '2026-08-18T10:30:00Z',
    deliveryDeadline: '2026-08-18T19:00:00Z',
    deadlineMinutesRemaining: 405,
    stage: 'Stock Allocated',
    priority: 'Medium',
    priorityScore: 55,
    priorityFactors: [
      { name: 'Standard Buffer', scoreContribution: 30, description: '6+ hours remaining' }
    ],
    items: [
      {
        sku: 'SKU-1010',
        productName: 'Automated Conveyor Roller Drive Belt',
        requestedQty: 20,
        allocatedQty: 20,
        unitPrice: 28.50,
        zone: 'Zone B',
        binLocation: 'B1-Bin 03'
      }
    ],
    shippingMethod: 'Standard Ground',
    hasException: false,
    aiRecommendation: 'Queue for wave picking at 12:30.'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-01',
    name: 'Marcus Vance',
    role: 'Picker',
    zone: 'Zone A',
    currentTask: 'Picking ORD-1038 (SKU-1011)',
    productivityScore: 96,
    status: 'Active',
    completedTasksToday: 42,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-02',
    name: 'Elena Rostova',
    role: 'Picker',
    zone: 'Zone B',
    currentTask: 'Picking ORD-1048 (SKU-1010)',
    productivityScore: 92,
    status: 'Active',
    completedTasksToday: 38,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-03',
    name: 'David Chen',
    role: 'Picker',
    zone: 'Zone B',
    currentTask: 'Picking ORD-1042 (Zone B items)',
    productivityScore: 89,
    status: 'Active',
    completedTasksToday: 35,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-04',
    name: 'Sarah Jenkins',
    role: 'Packer',
    zone: 'Packing Area',
    currentTask: 'Packing ORD-1039 (Boeing Defense)',
    productivityScore: 98,
    status: 'Active',
    completedTasksToday: 54,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-05',
    name: 'Carlos Mendez',
    role: 'Packer',
    zone: 'Packing Area',
    currentTask: 'Waiting for pick batch',
    productivityScore: 85,
    status: 'Active',
    completedTasksToday: 29,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-06',
    name: 'Amara Okafor',
    role: 'QC Inspector',
    zone: 'Quality Area',
    currentTask: 'Inspecting ORD-1040 (Bosch Servo)',
    productivityScore: 95,
    status: 'Active',
    completedTasksToday: 48,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-07',
    name: 'Kevin Wright',
    role: 'Dispatcher',
    zone: 'Dispatch Area',
    currentTask: 'Loading DHL Express Truck',
    productivityScore: 94,
    status: 'Active',
    completedTasksToday: 60,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'EMP-08',
    name: 'Rachel Adams',
    role: 'Warehouse Manager',
    zone: 'Control Tower',
    currentTask: 'Reviewing AI Congestion Alerts',
    productivityScore: 99,
    status: 'Active',
    completedTasksToday: 120,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_ZONES: WarehouseZone[] = [
  {
    id: 'ZONE-A',
    name: 'Zone A - Micro Electronics & Sensors',
    code: 'ZA',
    category: 'High Value Electronics',
    totalBins: 120,
    totalItemsCount: 1450,
    activeWorkersCount: 3,
    pendingPicksCount: 14,
    congestionLevel: 'Medium',
    efficiencyRate: 91,
    heatmapScore: 65
  },
  {
    id: 'ZONE-B',
    name: 'Zone B - Heavy Machinery & Drive Hardware',
    code: 'ZB',
    category: 'Heavy Industrial',
    totalBins: 95,
    totalItemsCount: 820,
    activeWorkersCount: 6,
    pendingPicksCount: 47, // High Congestion!
    congestionLevel: 'Severe',
    efficiencyRate: 74,
    heatmapScore: 95 // Hotspot!
  },
  {
    id: 'ZONE-C',
    name: 'Zone C - Power & Instrumentation',
    code: 'ZC',
    category: 'Energy & Pressure Systems',
    totalBins: 110,
    totalItemsCount: 1100,
    activeWorkersCount: 2,
    pendingPicksCount: 8,
    congestionLevel: 'Low',
    efficiencyRate: 95,
    heatmapScore: 28
  },
  {
    id: 'ZONE-D',
    name: 'Zone D - Robotics & Safety Wrap',
    code: 'ZD',
    category: 'Robotics & Materials',
    totalBins: 80,
    totalItemsCount: 640,
    activeWorkersCount: 2,
    pendingPicksCount: 6,
    congestionLevel: 'Low',
    efficiencyRate: 93,
    heatmapScore: 32
  },
  {
    id: 'ZONE-PK',
    name: 'Packing Area - Main Hub',
    code: 'PK',
    category: 'Packaging Stations',
    totalBins: 12,
    totalItemsCount: 0,
    activeWorkersCount: 2,
    pendingPicksCount: 18, // Queue bottleneck
    congestionLevel: 'High',
    efficiencyRate: 82,
    heatmapScore: 84
  },
  {
    id: 'ZONE-QC',
    name: 'Quality Inspection Lab',
    code: 'QC',
    category: 'Compliance & Testing',
    totalBins: 8,
    totalItemsCount: 0,
    activeWorkersCount: 1,
    pendingPicksCount: 5,
    congestionLevel: 'Medium',
    efficiencyRate: 89,
    heatmapScore: 50
  },
  {
    id: 'ZONE-DS',
    name: 'Dispatch Loading Bays',
    code: 'DS',
    category: 'Outbound Logistics',
    totalBins: 6,
    totalItemsCount: 0,
    activeWorkersCount: 2,
    pendingPicksCount: 12,
    congestionLevel: 'Medium',
    efficiencyRate: 88,
    heatmapScore: 58
  },
  {
    id: 'ZONE-RC',
    name: 'Inbound Receiving Docks',
    code: 'RC',
    category: 'Inbound Supplies',
    totalBins: 10,
    totalItemsCount: 400,
    activeWorkersCount: 2,
    pendingPicksCount: 2,
    congestionLevel: 'Low',
    efficiencyRate: 94,
    heatmapScore: 22
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'AeroTech Components Ltd',
    productsSupplied: ['SKU-1001', 'SKU-1006', 'SKU-1009'],
    leadTimeDays: 2,
    avgLeadTimeDays: 2,
    reliabilityRate: 98,
    reliabilityScore: 98,
    lastOrderDate: '2026-08-10',
    lastDelivery: '2026-08-10',
    pendingOrdersCount: 1,
    performanceScore: 96,
    activeSkuCount: 3,
    fillRate: 99.2,
    location: 'Austin, TX',
    deliveryHistory: [true, true, true, true, true, true, false, true, true, true],
    contractType: 'Tier-1 Strategic SLA',
    paymentTerms: 'Net 30',
    aiRecommendation: 'Primary supplier for urgent micro-sensor restock. Highest SLA accuracy.'
  },
  {
    id: 'SUP-02',
    name: 'Global Heavy Parts Inc',
    productsSupplied: ['SKU-1002', 'SKU-1005'],
    leadTimeDays: 5,
    avgLeadTimeDays: 5,
    reliabilityRate: 89,
    reliabilityScore: 89,
    lastOrderDate: '2026-08-04',
    lastDelivery: '2026-08-04',
    pendingOrdersCount: 2,
    performanceScore: 84,
    activeSkuCount: 2,
    fillRate: 91.5,
    location: 'Detroit, MI',
    deliveryHistory: [true, false, true, true, false, true, true, true, false, true],
    contractType: 'Preferred Vendor',
    paymentTerms: 'Net 45',
    aiRecommendation: 'Lead time 5 days. Reorder SKU-1005 3 days prior to stockout threshold.'
  },
  {
    id: 'SUP-03',
    name: 'OptiWave Networks',
    productsSupplied: ['SKU-1003', 'SKU-1011'],
    leadTimeDays: 3,
    avgLeadTimeDays: 3,
    reliabilityRate: 94,
    reliabilityScore: 94,
    lastOrderDate: '2026-08-08',
    lastDelivery: '2026-08-08',
    pendingOrdersCount: 0,
    performanceScore: 92,
    activeSkuCount: 2,
    fillRate: 96.8,
    location: 'San Jose, CA',
    deliveryHistory: [true, true, true, true, false, true, true, true, true, true],
    contractType: 'Standard SLA',
    paymentTerms: 'Net 30',
    aiRecommendation: 'High quality optical transceiver manufacturer.'
  },
  {
    id: 'SUP-04',
    name: 'VoltTech Energy Corp',
    productsSupplied: ['SKU-1004'],
    leadTimeDays: 4,
    avgLeadTimeDays: 4,
    reliabilityRate: 96,
    reliabilityScore: 96,
    lastOrderDate: '2026-08-12',
    lastDelivery: '2026-08-12',
    pendingOrdersCount: 0,
    performanceScore: 94,
    activeSkuCount: 1,
    fillRate: 97.4,
    location: 'Seattle, WA',
    deliveryHistory: [true, true, true, true, true, true, true, false, true, true],
    contractType: 'Hazmat SLA',
    paymentTerms: 'Net 15',
    aiRecommendation: 'Hazmat shipping certified. Consistent 4-day delivery performance.'
  }
];

export const INITIAL_EXCEPTIONS: Exception[] = [
  {
    id: 'EXP-801',
    orderId: 'ORD-1042',
    sku: 'SKU-1001',
    type: 'Stock shortage',
    problem: 'ORD-1042 requires 10 units of SKU-1001, but only 7 units available in Zone A bin A1-04.',
    impact: 'Critical customer ORD-1042 delivery risk. SLA breach penalty $1,200 if delayed past 14:00.',
    priority: 'Critical',
    aiAnalysis: 'Order priority score is 94/100 (Enterprise VIP tier). Stock shortfall is 3 units. Lower priority ORD-1051 holds 0 allocated units.',
    recommendedResolution: 'Allocate all 7 available units to ORD-1042 immediately. Issue emergency 3-unit replenishment PO to AeroTech Components (2-day air). Notify customer of partial batch release.',
    status: 'Active',
    assignedEmployeeId: 'EMP-08',
    assignedEmployeeName: 'Rachel Adams',
    createdAt: '2026-08-18T10:16:00Z',
    timeline: [
      { timestamp: '10:15:00', action: 'Order ORD-1042 ingested', author: 'ERP System' },
      { timestamp: '10:16:00', action: 'Stock allocation check failed (Shortfall: 3 units)', author: 'WareMind AI Engine' },
      { timestamp: '10:16:05', action: 'Exception EXP-801 raised with CRITICAL priority', author: 'WareMind AI Engine' }
    ]
  },
  {
    id: 'EXP-802',
    orderId: 'ORD-1035',
    sku: 'SKU-1003',
    type: 'Dispatch delay',
    problem: 'Courier FedEx Express delayed arrival by 45 minutes for ORD-1035.',
    impact: 'Guaranteed 12:00 PM delivery window missed for ABB Automation.',
    priority: 'High',
    aiAnalysis: 'Traffic congestion on Highway 101 caused FedEx pickup delay. Internal packing completed on schedule.',
    recommendedResolution: 'Reroute dispatch shipment to Hot-Shot Air Freight Shuttle scheduled at Dock Bay 2.',
    status: 'In Resolution',
    assignedEmployeeId: 'EMP-07',
    assignedEmployeeName: 'Kevin Wright',
    createdAt: '2026-08-18T11:20:00Z',
    timeline: [
      { timestamp: '11:20:00', action: 'Dispatch cutoff timer expired', author: 'Logistics Monitor' },
      { timestamp: '11:22:00', action: 'AI recommended hot-shot shuttle re-assignment', author: 'WareMind AI Engine' }
    ]
  },
  {
    id: 'EXP-803',
    orderId: 'ORD-1044',
    sku: 'SKU-1005',
    type: 'Picking error',
    problem: 'Picker retrieved wrong variant for SKU-1005 (hydraulic valve 50 BAR instead of 100 BAR).',
    impact: 'Quality inspection rejection. Packing paused at Desk 3.',
    priority: 'Medium',
    aiAnalysis: 'Bin labeling ambiguity on B5-Bin 18. Picker retrieved adjacent bin item.',
    recommendedResolution: 'Return incorrect item to B5-Bin 17. Re-issue replacement picking task for EMP-02.',
    status: 'Investigating',
    assignedEmployeeId: 'EMP-06',
    assignedEmployeeName: 'Amara Okafor',
    createdAt: '2026-08-18T11:05:00Z',
    timeline: [
      { timestamp: '11:05:00', action: 'QC scanner rejected barcode mismatch', author: 'QC Scanner' }
    ]
  }
];

export const INITIAL_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'REC-01',
    title: 'Smart Allocation for Critical Order ORD-1042',
    category: 'Allocation',
    impact: 'High',
    confidenceScore: 94,
    actionText: 'Allocate 7 units of SKU-1001 to ORD-1042 & trigger expedited supplier replenishment.',
    explanation: [
      'ORD-1042 delivery deadline is approaching in <45 minutes.',
      'Tesla Gigafactory is an Enterprise VIP customer with high SLA penalties.',
      'Available inventory (7 units) partially covers requested quantity (10 units).',
      'Delaying allocation creates 98% delivery breach risk.'
    ],
    affectedOrderIds: ['ORD-1042', 'ORD-1051'],
    affectedSkus: ['SKU-1001'],
    applied: false,
    createdAt: '2026-08-18T10:16:00Z'
  },
  {
    id: 'REC-02',
    title: 'Zone B Picking Congestion Mitigation',
    category: 'Capacity',
    impact: 'High',
    confidenceScore: 91,
    actionText: 'Redirect 12 pending picking tasks from Zone B through Zone C routing.',
    explanation: [
      'Zone B active picking tasks reached 47 tasks (300% of normal capacity).',
      'Worker density in aisle B2 is causing 4.2 min average delay per pick task.',
      'Rerouting wave picks reduces zone congestion by 34%.'
    ],
    affectedSkus: ['SKU-1002', 'SKU-1010'],
    applied: false,
    createdAt: '2026-08-18T10:30:00Z'
  },
  {
    id: 'REC-03',
    title: 'Automated Purchase Recommendation: SKU-1009',
    category: 'Inventory',
    impact: 'Medium',
    confidenceScore: 89,
    actionText: 'Create Purchase Recommendation for 60 units of SKU-1009 to AeroTech Ltd.',
    explanation: [
      'SKU-1009 stock is down to 1 available unit (0.2 days demand buffer).',
      'Supplier AeroTech lead time is 2 days.',
      'Preventative reorder avoids 4 anticipated backorders tomorrow.'
    ],
    affectedSkus: ['SKU-1009'],
    applied: false,
    createdAt: '2026-08-18T11:00:00Z'
  },
  {
    id: 'REC-04',
    title: 'Packing Area Staff Redistribution',
    category: 'Capacity',
    impact: 'High',
    confidenceScore: 93,
    actionText: 'Reassign 2 pickers from Zone D to Packing Desk 3 & Desk 4 for 60 minutes.',
    explanation: [
      'Packing queue reached 18 orders with average processing time of 7.4 min.',
      'Zone D picking workload is light (6 pending picks).',
      'Reassignment will increase packing throughput by estimated 22%.'
    ],
    applied: false,
    createdAt: '2026-08-18T11:15:00Z'
  }
];

export const INITIAL_PICKING_TASKS: PickingTask[] = [
  {
    id: 'PT-101',
    orderId: 'ORD-1038',
    pickerId: 'EMP-01',
    pickerName: 'Marcus Vance',
    zone: 'Zone A / Zone C',
    stage: 'Picking',
    priority: 'Critical',
    route: [
      { stepNumber: 1, location: 'C1-Bin 02', sku: 'SKU-1004', productName: 'Lithium Battery Pack', qtyToPick: 4 },
      { stepNumber: 2, location: 'A1-Bin 19', sku: 'SKU-1011', productName: 'PLC Controller Board', qtyToPick: 2 }
    ],
    estimatedDistanceMeters: 126,
    estimatedTimeSeconds: 260,
    routeJustification: 'Items sorted by warehouse proximity (Zone C -> Zone A) minimizing backtracking by 42 meters.'
  },
  {
    id: 'PT-102',
    orderId: 'ORD-1042',
    pickerId: 'EMP-03',
    pickerName: 'David Chen',
    zone: 'Zone A',
    stage: 'Assigned',
    priority: 'Critical',
    route: [
      { stepNumber: 1, location: 'A1-Bin 04', sku: 'SKU-1001', productName: 'Industrial Micro-Sensor Hub V4', qtyToPick: 7 },
      { stepNumber: 2, location: 'A2-Bin 10', sku: 'SKU-1006', productName: 'Smart Temp Transmitter', qtyToPick: 5 }
    ],
    estimatedDistanceMeters: 45,
    estimatedTimeSeconds: 110,
    routeJustification: 'Sequential aisle traversal in Zone A.'
  }
];

export const INITIAL_PACKING_TASKS: PackingTask[] = [
  {
    id: 'PKG-301',
    orderId: 'ORD-1039',
    packerId: 'EMP-04',
    packerName: 'Sarah Jenkins',
    packageCount: 2,
    actualWeightKg: 14.2,
    expectedWeightKg: 14.2,
    dimensionsCm: '40x30x25',
    shippingMethod: 'Express Air',
    status: 'Packing',
    weightMatch: true,
    itemCheckPassed: true
  }
];

export const INITIAL_QC_INSPECTIONS: QCInspection[] = [
  {
    id: 'QC-501',
    orderId: 'ORD-1040',
    inspectorId: 'EMP-06',
    inspectorName: 'Amara Okafor',
    status: 'Inspecting',
    checks: {
      correctSku: true,
      correctQuantity: true,
      productCondition: true,
      packagingCondition: true,
      labelAccuracy: true
    },
    notes: 'Housing seal intact. Serial number verified with ERP catalog.'
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-901',
    orderId: 'ORD-1035',
    customerName: 'ABB Automation Tech',
    courier: 'FedEx Express',
    trackingId: 'TRK-FDX-10293',
    destination: 'Chicago, IL (Hub 4)',
    shippingPriority: 'Critical',
    expectedDispatchTime: '12:00 PM',
    actualDispatchTime: undefined,
    status: 'Ready',
    delayRisk: 'Critical',
    delayReason: 'Carrier truck delay. Recommended hot-shot shuttle dispatch.'
  },
  {
    id: 'SHP-902',
    orderId: 'ORD-1045',
    customerName: 'Honeywell Industrial Controls',
    courier: 'DHL Express',
    trackingId: 'TRK-DHL-99214',
    destination: 'Austin, TX',
    shippingPriority: 'Medium',
    expectedDispatchTime: '3:30 PM',
    status: 'Ready',
    delayRisk: 'Low'
  }
];

export const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'SCENARIO-1',
    title: 'Scenario 1: Unexpected Stock Loss (5 Units SKU-1001)',
    description: 'Simulate damaged stock or inventory audit discrepancy on SKU-1001.',
    prompt: 'What happens if SKU-1001 available stock drops by 5 units right now?',
    impactSummary: 'Available stock drops from 7 to 2. Critical order ORD-1042 shortfall increases from 3 to 8 units. SLA breach probability rises to 99%.',
    affectedOrderCount: 3,
    stockRiskLevel: 'High',
    recommendedAction: 'Trigger instant cross-dock transfer from regional warehouse facility in San Jose (4-hour drive delivery).',
    expectedResult: 'Fulfills 2 immediate units, covers remaining shortfall by 16:00, avoiding total contract penalty.'
  },
  {
    id: 'SCENARIO-2',
    title: 'Scenario 2: Sudden High-Priority Order Influx',
    description: 'Simulate 3 new Enterprise VIP orders arriving simultaneously for Zone A & Zone C products.',
    prompt: 'What happens if 3 urgent VIP orders arrive within 10 minutes?',
    impactSummary: 'Zone A picking queue increases by 14 items. Picking fulfillment time increases by +18 minutes. Potential bottleneck at Packing Desk 1.',
    affectedOrderCount: 6,
    stockRiskLevel: 'Medium',
    recommendedAction: 'Activate AI Dynamic Re-Prioritization mode. Shift 2 packers to Zone A picking.',
    expectedResult: 'Maintains 98% on-time dispatch rate for VIP orders.'
  },
  {
    id: 'SCENARIO-3',
    title: 'Scenario 3: Worker Absence (2 Pickers Offline)',
    description: 'Simulate 2 primary pickers (Marcus Vance & Elena Rostova) going offline unexpectedly.',
    prompt: 'What happens if 2 pickers become unavailable in Zone B?',
    impactSummary: 'Zone B picking throughput drops by 40%. Backlog increases by 22 pending pick tasks within 1 hour.',
    affectedOrderCount: 8,
    stockRiskLevel: 'Low',
    recommendedAction: 'Reassign 1 QC inspector and 1 packing staff to wave picking in Zone B.',
    expectedResult: 'Restores picking throughput to 92% of nominal baseline.'
  },
  {
    id: 'SCENARIO-4',
    title: 'Scenario 4: 30-Minute Dispatch Dock Blockage',
    description: 'Simulate a mechanical door failure at Dispatch Loading Bay 2.',
    prompt: 'What happens if Loading Bay 2 is blocked for 30 minutes?',
    impactSummary: '5 express shipments delayed. Risk of missing scheduled DHL express airport transport flight.',
    affectedOrderCount: 5,
    stockRiskLevel: 'High',
    recommendedAction: 'Reroute express shipments to Dock Bay 4. Extend courier pickup window by 20 minutes via EDI dispatch alert.',
    expectedResult: 'Prevents missed flight cutoff with zero order cancellations.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Critical Stock Shortage',
    message: 'ORD-1042 requires 10 units of SKU-1001, but only 7 units are available.',
    type: 'critical',
    timestamp: '10:16 AM',
    read: false,
    linkView: 'inventory'
  },
  {
    id: 'NOTIF-2',
    title: 'Zone B Congestion Alert',
    message: 'Zone B picking congestion score reached 95/100 (Severe). AI recommends rerouting tasks.',
    type: 'warning',
    timestamp: '10:30 AM',
    read: false,
    linkView: 'warehouse'
  },
  {
    id: 'NOTIF-3',
    title: 'Carrier Delay Detected',
    message: 'FedEx Express pickup delayed for ORD-1035. Delay risk elevated to CRITICAL.',
    type: 'critical',
    timestamp: '11:20 AM',
    read: false,
    linkView: 'dispatch'
  }
];

export const INITIAL_PICKER_TRACKS: PickerLocationTrack[] = [
  {
    pickerId: 'EMP-01',
    pickerName: 'Marcus Vance',
    orderId: 'ORD-1042',
    currentZone: 'Zone A',
    currentX: 25,
    currentY: 35,
    speedMps: 1.4,
    stepsRemaining: 2,
    totalDistanceMeters: 85,
    remainingDistanceMeters: 28,
    waypoints: [
      { x: 15, y: 20, label: 'Start (Zone A Aisle 1)', completed: true },
      { x: 25, y: 35, label: 'Bin A1-04 (SKU-1001)', sku: 'SKU-1001', completed: false },
      { x: 40, y: 55, label: 'Bin A2-10 (SKU-1006)', sku: 'SKU-1006', completed: false },
      { x: 80, y: 85, label: 'Packing Station 1 Dropoff', completed: false }
    ],
    turnByTurn: [
      'Proceed 15m straight through Aisle A1',
      'Turn Right at Shelf 4 to pick 7x SKU-1001 (Micro-Sensor Hub)',
      'Continue 20m East towards Aisle A2',
      'Pick 5x SKU-1006 (Thermal Module)',
      'Proceed South 30m to Packing Station Desk 1'
    ]
  },
  {
    pickerId: 'EMP-02',
    pickerName: 'Elena Rostova',
    orderId: 'ORD-1035',
    currentZone: 'Zone B',
    currentX: 60,
    currentY: 45,
    speedMps: 1.1,
    stepsRemaining: 3,
    totalDistanceMeters: 140,
    remainingDistanceMeters: 62,
    waypoints: [
      { x: 50, y: 20, label: 'Start (Zone B Aisle 2)', completed: true },
      { x: 60, y: 45, label: 'Bin B2-12 (SKU-1002)', sku: 'SKU-1002', completed: true },
      { x: 75, y: 60, label: 'Bin B3-08 (SKU-1005)', sku: 'SKU-1005', completed: false },
      { x: 85, y: 85, label: 'Heavy Bay Dropoff', completed: false }
    ],
    turnByTurn: [
      'Enter Zone B Heavy Machinery Corridor',
      'Stop at Bin B2-12 for 3x Heavy Actuator Engine',
      'Bypass congested aisle B2 via Zone C connector',
      'Pick 2x Industrial Gear Assembly from B3-08',
      'Drop off at Heavy Cargo Staging Area'
    ]
  }
];

export const INITIAL_CARRIER_TRACKS: CarrierGpsTrack[] = [
  {
    shipmentId: 'SHP-901',
    orderId: 'ORD-1035',
    courier: 'FedEx Air Cargo',
    trackingNumber: 'TRK-FDX-88035',
    driverName: 'Captain James Miller',
    vehicleType: 'Boeing 767 Freight Flight 402',
    lat: 30.2672,
    lng: -97.7431,
    speedKmh: 650,
    origin: 'Austin Main Hub (TX-01)',
    destination: 'Tesla Gigafactory, Austin TX',
    etaMinutes: 24,
    checkpoints: [
      { name: 'Loaded at Austin Hub Gate A2', timestamp: '11:00 AM', completed: true, lat: 30.2672, lng: -97.7431 },
      { name: 'In Flight — Altitude 12,000 ft', timestamp: '11:15 AM', completed: true, lat: 30.2100, lng: -97.6800 },
      { name: 'Approach Runway 18R', timestamp: '11:35 AM (Est)', completed: false, lat: 30.1900, lng: -97.6600 },
      { name: 'Final Delivery Ramp 4', timestamp: '11:45 AM (Est)', completed: false, lat: 30.1800, lng: -97.6400 }
    ],
    weatherAlert: 'Moderate turbulence ahead near Travis County. Route adjusted +2 min.'
  },
  {
    shipmentId: 'SHP-902',
    orderId: 'ORD-1038',
    courier: 'DHL Express Shuttle',
    trackingNumber: 'TRK-DHL-44012',
    driverName: 'Robert Vance',
    vehicleType: 'EV Cargo Van Hot-Shot #12',
    lat: 37.7749,
    lng: -122.4194,
    speedKmh: 72,
    origin: 'San Jose Logistics Hub',
    destination: 'Apple Park Campus, Cupertino CA',
    etaMinutes: 18,
    checkpoints: [
      { name: 'Dispatched from San Jose Bay 3', timestamp: '10:45 AM', completed: true, lat: 37.3382, lng: -121.8863 },
      { name: 'Passed Hwy 280 Interchange', timestamp: '11:05 AM', completed: true, lat: 37.3150, lng: -122.0100 },
      { name: 'Arriving Gate 2 Perimeter', timestamp: '11:23 AM (Est)', completed: false, lat: 37.3340, lng: -122.0090 }
    ]
  }
];
