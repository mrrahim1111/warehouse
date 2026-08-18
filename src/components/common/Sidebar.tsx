import React, { useState } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import type { ViewType } from '../../context/WarehouseContext';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageSearch,
  Map,
  CheckSquare,
  Box,
  ShieldCheck,
  Truck,
  AlertTriangle,
  BrainCircuit,
  BarChart3,
  Building2,
  Users,
  Sparkles,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, exceptions, orders, presentationMode, t } = useWarehouse();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const activeExceptionsCount = exceptions.filter(e => e.status !== 'Resolved').length;
  const criticalOrdersCount = orders.filter(o => o.priority === 'Critical').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'orders', label: t('orders'), icon: ShoppingBag, badge: criticalOrdersCount, badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    { id: 'inventory', label: t('inventory'), icon: PackageSearch },
    { id: 'warehouse', label: t('warehouse'), icon: Map },
    { id: 'picking', label: t('picking'), icon: CheckSquare },
    { id: 'packing', label: t('packing'), icon: Box },
    { id: 'qc', label: t('qc'), icon: ShieldCheck },
    { id: 'dispatch', label: t('dispatch'), icon: Truck },
    { id: 'exceptions', label: t('exceptions'), icon: AlertTriangle, badge: activeExceptionsCount, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' },
    { id: 'ai-center', label: t('aiCenter'), icon: BrainCircuit, badge: 4, badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    { id: 'suppliers', label: t('suppliers'), icon: Building2 },
    { id: 'employees', label: t('employees'), icon: Users },
    { id: 'ai-assistant', label: t('aiAssistant'), icon: Sparkles },
    { id: 'settings', label: t('settings'), icon: Settings }
  ];

  if (presentationMode) {
    // Return streamlined sidebar for presentation mode
    return null;
  }

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wider text-white">WAREMIND <span className="text-cyan-400">AI</span></h1>
              <p className="text-[10px] font-medium tracking-tight text-slate-400">Enterprise Operations</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md">
            <Zap className="h-5 w-5 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                title={collapsed ? item.label : undefined}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-900/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      {!collapsed && (
        <div className="border-t border-slate-800/80 p-3">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-400">AI Engine Active</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Latency: 14ms • SLA Score: 87%</p>
          </div>
        </div>
      )}
    </aside>
  );
};
