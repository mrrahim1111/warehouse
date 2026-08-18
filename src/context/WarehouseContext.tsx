import React, { createContext, useContext, useState } from 'react';
import type {
  Order,
  InventoryItem,
  Exception,
  WarehouseZone,
  Employee,
  Supplier,
  Shipment,
  AIRecommendation,
  PickingTask,
  PackingTask,
  QCInspection,
  NotificationItem,
  SimulationStep,
  WhatIfScenario
} from '../types/warehouse';
import {
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_ZONES,
  INITIAL_SUPPLIERS,
  INITIAL_EXCEPTIONS,
  INITIAL_AI_RECOMMENDATIONS,
  INITIAL_PICKING_TASKS,
  INITIAL_PACKING_TASKS,
  INITIAL_QC_INSPECTIONS,
  INITIAL_SHIPMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { predictStockout } from '../services/aiEngine';
import type { LanguageCode } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';
import confetti from 'canvas-confetti';

export type ViewType =
  | 'dashboard'
  | 'orders'
  | 'inventory'
  | 'warehouse'
  | 'picking'
  | 'packing'
  | 'qc'
  | 'dispatch'
  | 'exceptions'
  | 'ai-center'
  | 'analytics'
  | 'suppliers'
  | 'employees'
  | 'ai-assistant'
  | 'settings'
  | 'login';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface WarehouseContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  presentationMode: boolean;
  setPresentationMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  togglePresentationMode: () => void;
  
  // Language & i18n
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  
  // Data State
  orders: Order[];
  inventory: InventoryItem[];
  exceptions: Exception[];
  zones: WarehouseZone[];
  employees: Employee[];
  suppliers: Supplier[];
  shipments: Shipment[];
  aiRecommendations: AIRecommendation[];
  pickingTasks: PickingTask[];
  packingTasks: PackingTask[];
  qcInspections: QCInspection[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];
  
  // Modals & Selections
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedExceptionId: string | null;
  setSelectedExceptionId: (id: string | null) => void;
  selectedSku: string | null;
  setSelectedSku: (sku: string | null) => void;
  isCommandBarOpen: boolean;
  setIsCommandBarOpen: (open: boolean) => void;
  isLiveSimOpen: boolean;
  setIsLiveSimOpen: (open: boolean) => void;
  
  // Simulation State
  isSimulating: boolean;
  currentSimStep: number;
  simSteps: SimulationStep[];
  activeWhatIf: WhatIfScenario | null;
  setActiveWhatIf: (scenario: WhatIfScenario | null) => void;
  
  // Actions
  allocateInventory: (orderId: string, sku: string, qty: number) => void;
  applyRecommendation: (recId: string) => void;
  resolveException: (exceptionId: string) => void;
  reportPickingError: (orderId: string, problem: string) => void;
  passQCInspection: (orderId: string) => void;
  failQCInspection: (orderId: string, reason: string) => void;
  dispatchShipment: (shipmentId: string) => void;
  createReorder: (sku: string, qty: number) => void;
  rerouteZoneB: () => void;
  redistributePackers: () => void;
  startLiveSimulation: () => void;
  nextSimStep: () => void;
  stopLiveSimulation: () => void;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  };
  
  // Core Entities
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [exceptions, setExceptions] = useState<Exception[]>(INITIAL_EXCEPTIONS);
  const [zones, setZones] = useState<WarehouseZone[]>(INITIAL_ZONES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);
  const [pickingTasks] = useState<PickingTask[]>(INITIAL_PICKING_TASKS);
  const [packingTasks] = useState<PackingTask[]>(INITIAL_PACKING_TASKS);
  const [qcInspections, setQcInspections] = useState<QCInspection[]>(INITIAL_QC_INSPECTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Selection State
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState<boolean>(false);
  const [isLiveSimOpen, setIsLiveSimOpen] = useState<boolean>(false);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentSimStep, setCurrentSimStep] = useState<number>(0);
  const [activeWhatIf, setActiveWhatIf] = useState<WhatIfScenario | null>(null);

  const togglePresentationMode = () => {
    setPresentationMode(prev => !prev);
    addToast(
      presentationMode ? 'Standard Workspace' : 'Presentation Mode Activated',
      presentationMode ? 'Returned to full operational UI view.' : 'UI cleaned up for hackathon judging presentation.',
      'info'
    );
  };

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // 1. ALLOCATE INVENTORY (Smart Allocation)
  const allocateInventory = (orderId: string, sku: string, qty: number) => {
    setOrders(prevOrders =>
      prevOrders.map(o => {
        if (o.id === orderId) {
          const updatedItems = o.items.map(item =>
            item.sku === sku ? { ...item, allocatedQty: Math.min(item.requestedQty, item.allocatedQty + qty) } : item
          );
          return {
            ...o,
            items: updatedItems,
            stage: 'Stock Allocated',
            aiRecommendation: 'Inventory allocated successfully. Pick task generated.'
          };
        }
        return o;
      })
    );

    // Deduct stock from inventory
    setInventory(prevInv =>
      prevInv.map(item => {
        if (item.sku === sku) {
          const newCurrent = Math.max(0, item.currentStock - qty);
          const newAvailable = Math.max(0, item.availableStock - qty);
          const forecast = predictStockout({ ...item, availableStock: newAvailable, currentStock: newCurrent });
          return {
            ...item,
            currentStock: newCurrent,
            availableStock: newAvailable,
            status: forecast.stockoutRisk === 'Critical' ? 'Critical' : forecast.stockoutRisk === 'High' ? 'Low Stock' : item.status,
            aiForecast: forecast.aiAlert
          };
        }
        return item;
      })
    );

    // Trigger celebratory confetti effect for hero scenario
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    addToast('Smart Stock Allocation Applied', `Successfully allocated ${qty} units of ${sku} to Order ${orderId}.`, 'success');
  };

  // 2. APPLY AI RECOMMENDATION
  const applyRecommendation = (recId: string) => {
    setAiRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, applied: true } : r))
    );

    const rec = aiRecommendations.find(r => r.id === recId);

    if (recId === 'REC-01' || rec?.title.includes('ORD-1042')) {
      allocateInventory('ORD-1042', 'SKU-1001', 7);
    } else if (recId === 'REC-02' || rec?.title.includes('Zone B')) {
      rerouteZoneB();
    } else if (recId === 'REC-03' || rec?.title.includes('SKU-1009')) {
      createReorder('SKU-1009', 60);
    } else if (recId === 'REC-04' || rec?.title.includes('Packing Area')) {
      redistributePackers();
    } else {
      addToast('AI Recommendation Applied', rec?.title || 'Action applied successfully.', 'success');
    }
  };

  // 3. REROUTE ZONE B CONGESTION
  const rerouteZoneB = () => {
    setZones(prev =>
      prev.map(z =>
        z.code === 'ZB'
          ? { ...z, congestionLevel: 'Medium', pendingPicksCount: 22, heatmapScore: 45, efficiencyRate: 88 }
          : z.code === 'ZC'
          ? { ...z, pendingPicksCount: 18, heatmapScore: 50 }
          : z
      )
    );
    addToast('Zone B Congestion Mitigated', '12 wave picking tasks rerouted through Zone C bypass aisle.', 'success');
  };

  // 4. REDISTRIBUTE PACKERS
  const redistributePackers = () => {
    setZones(prev =>
      prev.map(z => z.code === 'PK' ? { ...z, activeWorkersCount: 4, congestionLevel: 'Medium', efficiencyRate: 94 } : z)
    );
    addToast('Staff Reassigned', '2 pickers reassigned to Packing Desks 3 & 4. Throughput expected +22%.', 'success');
  };

  // 5. RESOLVE EXCEPTION
  const resolveException = (exceptionId: string) => {
    setExceptions(prev =>
      prev.map(e => {
        if (e.id === exceptionId) {
          return {
            ...e,
            status: 'Resolved',
            resolvedAt: new Date().toISOString(),
            timeline: [
              ...e.timeline,
              { timestamp: new Date().toLocaleTimeString(), action: 'Exception marked as Resolved by Operator', author: 'Warehouse Manager' }
            ]
          };
        }
        return e;
      })
    );

    const exc = exceptions.find(e => e.id === exceptionId);

    if (exc) {
      setOrders(prev =>
        prev.map(o => (o.id === exc.orderId ? { ...o, hasException: false, exceptionId: undefined } : o))
      );
    }

    addToast('Exception Resolved', `Exception ${exceptionId} resolved successfully.`, 'success');
  };

  // 6. REPORT PICKING ERROR
  const reportPickingError = (orderId: string, problem: string) => {
    const newExcId = `EXP-${Math.floor(800 + Math.random() * 100)}`;
    const newExc: Exception = {
      id: newExcId,
      orderId,
      type: 'Picking error',
      problem,
      impact: 'Order fulfillment paused at Picking stage.',
      priority: 'High',
      aiAnalysis: 'Operator reported mismatch or missing item during picking route.',
      recommendedResolution: 'Verify bin inventory & issue replacement picking task.',
      status: 'Active',
      assignedEmployeeName: 'Marcus Vance',
      createdAt: new Date().toISOString(),
      timeline: [
        { timestamp: new Date().toLocaleTimeString(), action: 'Picking error reported by worker', author: 'Picker' }
      ]
    };

    setExceptions(prev => [newExc, ...prev]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, hasException: true, exceptionId: newExcId } : o));

    addToast('Picking Error Reported', `Exception ${newExcId} generated for Order ${orderId}.`, 'warning');
  };

  // 7. QUALITY CHECK PASS/FAIL
  const passQCInspection = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, stage: 'Ready for Dispatch', aiRecommendation: 'QC passed. Staged for shipping carrier.' } : o))
    );
    setQcInspections(prev =>
      prev.map(qc => (qc.orderId === orderId ? { ...qc, status: 'Passed' } : qc))
    );
    addToast('QC Passed', `Order ${orderId} passed quality inspection. Ready for Dispatch!`, 'success');
  };

  const failQCInspection = (orderId: string, reason: string) => {
    const newExcId = `EXP-${Math.floor(850 + Math.random() * 50)}`;
    const newExc: Exception = {
      id: newExcId,
      orderId,
      type: 'Quality failure',
      problem: `QC Inspection failed for Order ${orderId}: ${reason}`,
      impact: 'Packaging & SKU compliance hold.',
      priority: 'High',
      aiAnalysis: 'Visual inspection barcode or item housing failed compliance rules.',
      recommendedResolution: 'Return batch to re-pack desk for inspection audit.',
      status: 'Active',
      createdAt: new Date().toISOString(),
      timeline: [
        { timestamp: new Date().toLocaleTimeString(), action: 'QC Inspection failed', author: 'QC Inspector' }
      ]
    };

    setExceptions(prev => [newExc, ...prev]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, hasException: true, exceptionId: newExcId, stage: 'Quality Check' } : o));
    setQcInspections(prev => prev.map(qc => (qc.orderId === orderId ? { ...qc, status: 'Failed' } : qc)));

    addToast('QC Failed', `Exception ${newExcId} created for Order ${orderId}.`, 'error');
  };

  // 8. DISPATCH SHIPMENT
  const dispatchShipment = (shipmentId: string) => {
    setShipments(prev =>
      prev.map(s => (s.id === shipmentId ? { ...s, status: 'Dispatched', actualDispatchTime: new Date().toLocaleTimeString() } : s))
    );

    const shp = shipments.find(s => s.id === shipmentId);
    if (shp) {
      setOrders(prev => prev.map(o => (o.id === shp.orderId ? { ...o, stage: 'Dispatched' } : o)));
    }

    addToast('Shipment Dispatched', `Shipment ${shipmentId} dispatched successfully. Tracking active.`, 'success');
  };

  // 9. CREATE REORDER
  const createReorder = (sku: string, qty: number) => {
    setInventory(prev =>
      prev.map(item => (item.sku === sku ? { ...item, status: 'Healthy', availableStock: item.availableStock + qty, currentStock: item.currentStock + qty, aiForecast: 'Reorder placed. Restock batch en route.' } : item))
    );
    addToast('Purchase Order Created', `Generated PO for ${qty} units of ${sku}.`, 'success');
  };

  // 10. LIVE WAREHOUSE SIMULATION STEPS
  const simSteps: SimulationStep[] = [
    {
      stepIndex: 1,
      title: 'New Urgent Order Received',
      description: 'Order #ORD-1042 ingested from Tesla Gigafactory ERP.',
      detail: 'Requested: 10x SKU-1001 (Micro-Sensor Hub) & 5x SKU-1006. Delivery deadline: 45 minutes.',
      timestamp: '10:15:00 AM',
      affectedEntity: 'ORD-1042',
      type: 'order'
    },
    {
      stepIndex: 2,
      title: 'AI Priority Score Calculated',
      description: 'Priority Score: 94 / 100 (CRITICAL).',
      detail: 'Factors: Delivery Deadline (35pts), Enterprise VIP SLA (25pts), Express Air (15pts), Order Value (18pts).',
      timestamp: '10:15:05 AM',
      affectedEntity: 'ORD-1042',
      type: 'ai'
    },
    {
      stepIndex: 3,
      title: 'Inventory Check & Shortage Detected',
      description: 'Available stock check for SKU-1001.',
      detail: 'Required: 10 units. Available: 7 units. Stock Shortfall: 3 units.',
      timestamp: '10:15:12 AM',
      affectedEntity: 'SKU-1001',
      type: 'inventory'
    },
    {
      stepIndex: 4,
      title: 'AI Smart Allocation Executed',
      description: 'Allocate all 7 available units to ORD-1042.',
      detail: 'Reason: Priority 94/100 exceeds lower priority orders. Emergency PO triggered for 3-unit shortfall.',
      timestamp: '10:15:20 AM',
      affectedEntity: 'ORD-1042',
      type: 'ai'
    },
    {
      stepIndex: 5,
      title: 'AI Picking Route Optimized',
      description: 'Picking Task PT-102 generated for Marcus Vance.',
      detail: 'Route: A1-Bin 04 -> A2-Bin 10 -> Packing Station 1. Walking distance: 45m (1m 50s).',
      timestamp: '10:15:35 AM',
      affectedEntity: 'Zone A',
      type: 'pick'
    },
    {
      stepIndex: 6,
      title: 'Picking Complete & Transferred to Packing',
      description: '7 units SKU-1001 picked and verified.',
      detail: 'Transferred to Packing Desk 2 (Sarah Jenkins). Weight check scan pending.',
      timestamp: '10:17:10 AM',
      affectedEntity: 'ORD-1042',
      type: 'pack'
    },
    {
      stepIndex: 7,
      title: 'Packing & Weight Validation Passed',
      description: 'Package boxed, weighed (8.4kg matching expected) and labeled.',
      detail: 'Express Air Barcode generated: TRK-FDX-99042.',
      timestamp: '10:18:25 AM',
      affectedEntity: 'ORD-1042',
      type: 'pack'
    },
    {
      stepIndex: 8,
      title: 'Quality Check & Compliance Approved',
      description: 'Amara Okafor completed physical housing & serial scan.',
      detail: 'Compliance: PASSED. Moved to Dispatch Bay 1.',
      timestamp: '10:19:15 AM',
      affectedEntity: 'ORD-1042',
      type: 'qc'
    },
    {
      stepIndex: 9,
      title: 'Dispatched via Hot-Shot Express Air',
      description: 'Order loaded onto FedEx Air Cargo Shuttle.',
      detail: 'Actual dispatch time: 10:20:00 AM (25 minutes ahead of SLA deadline!).',
      timestamp: '10:20:00 AM',
      affectedEntity: 'ORD-1042',
      type: 'dispatch'
    },
    {
      stepIndex: 10,
      title: 'Operational Analytics Updated',
      description: 'Warehouse Efficiency score updated to 94%.',
      detail: 'SLA Breach risk reduced to 0%. Customer notification dispatched.',
      timestamp: '10:20:10 AM',
      affectedEntity: 'Analytics',
      type: 'ai'
    }
  ];

  const startLiveSimulation = () => {
    setIsLiveSimOpen(true);
    setIsSimulating(true);
    setCurrentSimStep(1);
    addToast('Live Warehouse Simulation Started', 'Simulating Order ORD-1042 lifecycle event...', 'info');
  };

  const nextSimStep = () => {
    if (currentSimStep < simSteps.length) {
      const next = currentSimStep + 1;
      setCurrentSimStep(next);

      // Execute live side effects as simulation progresses
      if (next === 4) {
        allocateInventory('ORD-1042', 'SKU-1001', 7);
      } else if (next === 6) {
        setOrders(prev => prev.map(o => o.id === 'ORD-1042' ? { ...o, stage: 'Packing' } : o));
      } else if (next === 8) {
        setOrders(prev => prev.map(o => o.id === 'ORD-1042' ? { ...o, stage: 'Quality Check' } : o));
      } else if (next === 9) {
        setOrders(prev => prev.map(o => o.id === 'ORD-1042' ? { ...o, stage: 'Dispatched' } : o));
      }
    } else {
      stopLiveSimulation();
    }
  };

  const stopLiveSimulation = () => {
    setIsSimulating(false);
    addToast('Simulation Complete', 'Hero scenario Order ORD-1042 successfully fulfilled with 0 SLA delay!', 'success');
  };

  const resetDemoData = () => {
    setOrders(INITIAL_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setExceptions(INITIAL_EXCEPTIONS);
    setZones(INITIAL_ZONES);
    setEmployees(INITIAL_EMPLOYEES);
    setSuppliers(INITIAL_SUPPLIERS);
    setShipments(INITIAL_SHIPMENTS);
    setAiRecommendations(INITIAL_AI_RECOMMENDATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentSimStep(0);
    setIsSimulating(false);
    addToast('Demo State Reset', 'Restored initial mock warehouse data.', 'info');
  };

  return (
    <WarehouseContext.Provider
      value={{
        activeView,
        setActiveView,
        presentationMode,
        setPresentationMode,
        togglePresentationMode,
        currentLanguage,
        setLanguage,
        t,
        orders,
        inventory,
        exceptions,
        zones,
        employees,
        suppliers,
        shipments,
        aiRecommendations,
        pickingTasks,
        packingTasks,
        qcInspections,
        notifications,
        toasts,
        selectedOrderId,
        setSelectedOrderId,
        selectedExceptionId,
        setSelectedExceptionId,
        selectedSku,
        setSelectedSku,
        isCommandBarOpen,
        setIsCommandBarOpen,
        isLiveSimOpen,
        setIsLiveSimOpen,
        isSimulating,
        currentSimStep,
        simSteps,
        activeWhatIf,
        setActiveWhatIf,
        allocateInventory,
        applyRecommendation,
        resolveException,
        reportPickingError,
        passQCInspection,
        failQCInspection,
        dispatchShipment,
        createReorder,
        rerouteZoneB,
        redistributePackers,
        startLiveSimulation,
        nextSimStep,
        stopLiveSimulation,
        addToast,
        removeToast,
        markNotificationRead,
        resetDemoData
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
