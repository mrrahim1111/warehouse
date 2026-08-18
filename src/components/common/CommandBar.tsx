import React, { useState, useEffect, useRef } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import type { ViewType } from '../../context/WarehouseContext';
import {
  Search, LayoutDashboard, ShoppingBag, PackageSearch, Map,
  CheckSquare, Box, ShieldCheck, Truck, AlertTriangle, BrainCircuit,
  BarChart3, Package, Users, MessageSquare, Settings, Zap, Navigation
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export const CommandBar: React.FC = () => {
  const {
    isCommandBarOpen, setIsCommandBarOpen, setActiveView,
    startLiveSimulation, resetDemoData, togglePresentationMode,
    setSelectedOrderId, orders
  } = useWarehouse();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(!isCommandBarOpen);
      }
      if (e.key === 'Escape') setIsCommandBarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCommandBarOpen]);

  useEffect(() => {
    if (isCommandBarOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandBarOpen]);

  const navigate = (view: ViewType) => { setActiveView(view); setIsCommandBarOpen(false); };

  const items: CommandItem[] = [
    { id: 'act-navigation', label: 'Open Live GPS Navigation Tracker', description: 'Indoor picker coordinates & carrier transit telemetry', icon: <Navigation className="h-4 w-4 text-cyan-400" />, action: () => navigate('picking'), category: 'Actions' },
    { id: 'nav-dashboard', label: 'Go to Dashboard', description: 'Operational overview', icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('dashboard'), category: 'Navigation' },
    { id: 'nav-orders', label: 'Go to Orders', description: 'View all orders', icon: <ShoppingBag className="h-4 w-4" />, action: () => navigate('orders'), category: 'Navigation' },
    { id: 'nav-inventory', label: 'Go to Inventory', description: 'Stock management', icon: <PackageSearch className="h-4 w-4" />, action: () => navigate('inventory'), category: 'Navigation' },
    { id: 'nav-warehouse', label: 'Go to Warehouse Map', description: 'Zone heatmap', icon: <Map className="h-4 w-4" />, action: () => navigate('warehouse'), category: 'Navigation' },
    { id: 'nav-picking', label: 'Go to Picking', description: 'Route optimization', icon: <CheckSquare className="h-4 w-4" />, action: () => navigate('picking'), category: 'Navigation' },
    { id: 'nav-packing', label: 'Go to Packing', description: 'Packing workflow', icon: <Box className="h-4 w-4" />, action: () => navigate('packing'), category: 'Navigation' },
    { id: 'nav-qc', label: 'Go to Quality Check', description: 'QC inspections', icon: <ShieldCheck className="h-4 w-4" />, action: () => navigate('qc'), category: 'Navigation' },
    { id: 'nav-dispatch', label: 'Go to Dispatch', description: 'Shipment management', icon: <Truck className="h-4 w-4" />, action: () => navigate('dispatch'), category: 'Navigation' },
    { id: 'nav-exceptions', label: 'Go to Exceptions', description: 'Exception handling', icon: <AlertTriangle className="h-4 w-4" />, action: () => navigate('exceptions'), category: 'Navigation' },
    { id: 'nav-ai', label: 'Go to AI Command Center', description: 'AI recommendations', icon: <BrainCircuit className="h-4 w-4" />, action: () => navigate('ai-center'), category: 'Navigation' },
    { id: 'nav-analytics', label: 'Go to Analytics', description: 'Charts and metrics', icon: <BarChart3 className="h-4 w-4" />, action: () => navigate('analytics'), category: 'Navigation' },
    { id: 'nav-assistant', label: 'Go to AI Assistant', description: 'Chat with WareMind', icon: <MessageSquare className="h-4 w-4" />, action: () => navigate('ai-assistant'), category: 'Navigation' },
    { id: 'nav-suppliers', label: 'Go to Suppliers', description: 'Supplier management', icon: <Package className="h-4 w-4" />, action: () => navigate('suppliers'), category: 'Navigation' },
    { id: 'nav-employees', label: 'Go to Employees', description: 'Workforce management', icon: <Users className="h-4 w-4" />, action: () => navigate('employees'), category: 'Navigation' },
    { id: 'nav-settings', label: 'Go to Settings', description: 'System configuration', icon: <Settings className="h-4 w-4" />, action: () => navigate('settings'), category: 'Navigation' },
    { id: 'act-simulation', label: 'Run Live Simulation', description: 'Simulate ORD-1042 lifecycle', icon: <Zap className="h-4 w-4 text-cyan-400" />, action: () => { startLiveSimulation(); setIsCommandBarOpen(false); }, category: 'Actions' },
    { id: 'act-reset', label: 'Reset Demo Data', description: 'Restore initial state', icon: <Zap className="h-4 w-4 text-amber-400" />, action: () => { resetDemoData(); setIsCommandBarOpen(false); }, category: 'Actions' },
    { id: 'act-present', label: 'Toggle Presentation Mode', description: 'Clean UI for demo', icon: <Zap className="h-4 w-4 text-purple-400" />, action: () => { togglePresentationMode(); setIsCommandBarOpen(false); }, category: 'Actions' },
    // Quick order access
    ...orders.slice(0, 5).map(o => ({
      id: `order-${o.id}`,
      label: `View ${o.id}`,
      description: `${o.customerName} • ${o.priority} • $${o.orderValue.toLocaleString()}`,
      icon: <ShoppingBag className="h-4 w-4 text-cyan-400" />,
      action: () => { setSelectedOrderId(o.id); setActiveView('orders'); setIsCommandBarOpen(false); },
      category: 'Quick Access'
    }))
  ];

  const filtered = query
    ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()))
    : items;

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  if (!isCommandBarOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={() => setIsCommandBarOpen(false)} role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            aria-label="Search commands"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <kbd className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category} className="mb-2">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{category}</p>
              {categoryItems.map(item => (
                <button
                  key={item.id}
                  onClick={item.action}
                  aria-label={item.label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-400">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
