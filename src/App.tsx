import React from 'react';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandBar } from './components/common/CommandBar';
import { LiveSimulationModal } from './components/common/LiveSimulationModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { OrdersView } from './components/views/OrdersView';
import { InventoryView } from './components/views/InventoryView';
import { WarehouseView } from './components/views/WarehouseView';
import { PickingView } from './components/views/PickingView';
import { PackingView } from './components/views/PackingView';
import { QCView } from './components/views/QCView';
import { DispatchView } from './components/views/DispatchView';
import { ExceptionsView } from './components/views/ExceptionsView';
import { AIDecisionCenterView } from './components/views/AIDecisionCenterView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SuppliersView } from './components/views/SuppliersView';
import { EmployeesView } from './components/views/EmployeesView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { SettingsView } from './components/views/SettingsView';

const VIEW_MAP: Record<string, React.FC> = {
  dashboard: DashboardView,
  orders: OrdersView,
  inventory: InventoryView,
  warehouse: WarehouseView,
  picking: PickingView,
  packing: PackingView,
  qc: QCView,
  dispatch: DispatchView,
  exceptions: ExceptionsView,
  'ai-center': AIDecisionCenterView,
  analytics: AnalyticsView,
  suppliers: SuppliersView,
  employees: EmployeesView,
  'ai-assistant': AIAssistantView,
  settings: SettingsView,
};

const AppShell: React.FC = () => {
  const { activeView } = useWarehouse();
  const ActiveViewComponent = VIEW_MAP[activeView] || DashboardView;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <ActiveViewComponent />
        </main>
      </div>

      {/* Overlays */}
      <CommandBar />
      <LiveSimulationModal />
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <WarehouseProvider>
      <AppShell />
    </WarehouseProvider>
  );
}

export default App;
