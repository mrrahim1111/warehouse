import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShoppingBag, Clock, AlertTriangle, CheckSquare, Box, Truck,
  PackageSearch, XCircle, AlertOctagon, Timer,
  BrainCircuit, Sparkles, Zap, ChevronRight,
  Activity, ShieldCheck, Target
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    orders, inventory, exceptions, zones, aiRecommendations,
    setActiveView, setSelectedOrderId, applyRecommendation
  } = useWarehouse();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.stage === 'Created' || o.stage === 'Priority Assigned').length;
  const criticalOrders = orders.filter(o => o.priority === 'Critical').length;
  const pickingOrders = orders.filter(o => o.stage === 'Picking').length;
  const packingOrders = orders.filter(o => o.stage === 'Packing').length;
  const readyDispatch = orders.filter(o => o.stage === 'Ready for Dispatch').length;
  const lowStockItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;
  const outOfStock = inventory.filter(i => i.status === 'Out of Stock').length;
  const activeExceptions = exceptions.filter(e => e.status !== 'Resolved').length;
  const delayedOrders = orders.filter(o => o.deadlineMinutesRemaining < 0).length;

  const priorityOrders = orders
    .filter(o => o.priorityScore >= 80)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  const pendingRecs = aiRecommendations.filter(r => !r.applied);

  // Warehouse Health Scores
  const healthScores = {
    overall: 87,
    inventory: 91,
    fulfillment: 86,
    picking: 84,
    packing: 89,
    dispatch: 88,
    exceptions: 82
  };

  // AI Operations Summary
  const aiSummary = `Warehouse operations are ${healthScores.overall}% efficient today. ${criticalOrders} critical orders require immediate attention. SKU-1001 may run out within 2 days. Picking congestion detected in Zone B with ${zones.find(z => z.code === 'ZB')?.pendingPicksCount || 47} active tasks.`;

  return (
    <div className="space-y-6">
      {/* AI Operations Summary Card */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/30 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide text-white">AI OPERATIONS SUMMARY</h3>
              <p className="text-[11px] text-cyan-300/70">Real-time intelligence briefing • Updated 14s ago</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-300 mb-4">{aiSummary}</p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('ai-center')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> View {pendingRecs.length} Recommendations
            </button>
            <button
              onClick={() => {
                pendingRecs.forEach(r => applyRecommendation(r.id));
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
            >
              <Zap className="h-3.5 w-3.5" /> Apply All Recommended Actions
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard title="Total Orders" value={totalOrders} changeText="↑ 12% from yesterday" changeType="increase" icon={ShoppingBag} color="cyan" onClick={() => setActiveView('orders')} />
        <KpiCard title="Pending Orders" value={pendingOrders} changeText="2 new this hour" changeType="neutral" icon={Clock} color="indigo" onClick={() => setActiveView('orders')} />
        <KpiCard title="Critical Orders" value={criticalOrders} changeText="↑ 20% from yesterday" changeType="decrease" icon={AlertTriangle} color="rose" onClick={() => setActiveView('orders')} />
        <KpiCard title="In Picking" value={pickingOrders} changeText="3 assigned" changeType="neutral" icon={CheckSquare} color="amber" onClick={() => setActiveView('picking')} />
        <KpiCard title="In Packing" value={packingOrders} changeText="1 weight check" changeType="neutral" icon={Box} color="purple" onClick={() => setActiveView('packing')} />
        <KpiCard title="Ready Dispatch" value={readyDispatch} changeText="2 staged at bays" changeType="increase" icon={Truck} color="emerald" onClick={() => setActiveView('dispatch')} />
        <KpiCard title="Low Stock Items" value={lowStockItems} changeText="↑ 2 from morning" changeType="decrease" icon={PackageSearch} color="amber" onClick={() => setActiveView('inventory')} />
        <KpiCard title="Out of Stock" value={outOfStock} changeText="1 SKU backorder" changeType="decrease" icon={XCircle} color="rose" onClick={() => setActiveView('inventory')} />
        <KpiCard title="Active Exceptions" value={activeExceptions} changeText={`${activeExceptions} need resolution`} changeType="decrease" icon={AlertOctagon} color="rose" onClick={() => setActiveView('exceptions')} />
        <KpiCard title="Delayed Orders" value={delayedOrders} changeText="SLA breach risk" changeType="decrease" icon={Timer} color="rose" onClick={() => setActiveView('dispatch')} />
      </div>

      {/* Priority Orders Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Orders Requiring Immediate Attention</h3>
              <p className="text-xs text-slate-400">{priorityOrders.length} orders with priority score ≥ 80</p>
            </div>
          </div>
          <button onClick={() => setActiveView('orders')} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Score</th>
                <th className="px-4 py-3 font-semibold">Deadline</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">AI Recommendation</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {priorityOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => setSelectedOrderId(order.id)}>
                  <td className="px-4 py-3 font-bold text-white">{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.customerName}</td>
                  <td className="px-4 py-3"><StatusBadge type="priority" value={order.priority} size="sm" /></td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${order.priorityScore >= 90 ? 'text-red-400' : 'text-amber-400'}`}>
                      {order.priorityScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={order.deadlineMinutesRemaining <= 60 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                      {order.deadlineMinutesRemaining < 0 ? `OVERDUE ${Math.abs(order.deadlineMinutesRemaining)}m` : `${order.deadlineMinutesRemaining}m`}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge type="stage" value={order.stage} size="sm" /></td>
                  <td className="px-4 py-3 max-w-xs text-slate-300 truncate">{order.aiRecommendation}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                      className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/30"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Warehouse Health + Top Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Warehouse Health */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-lg bg-emerald-500/10 p-2"><Activity className="h-5 w-5 text-emerald-400" /></div>
            <div>
              <h3 className="text-sm font-bold text-white">Today's Warehouse Health</h3>
              <p className="text-xs text-slate-400">Composite performance scoring</p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-5">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${healthScores.overall}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <span className="text-3xl font-black text-white">{healthScores.overall}</span>
                <span className="text-sm text-slate-400">/100</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Inventory Health', score: healthScores.inventory, color: 'bg-emerald-500' },
              { label: 'Order Fulfillment', score: healthScores.fulfillment, color: 'bg-cyan-500' },
              { label: 'Picking Efficiency', score: healthScores.picking, color: 'bg-amber-500' },
              { label: 'Packing Efficiency', score: healthScores.packing, color: 'bg-indigo-500' },
              { label: 'Dispatch Performance', score: healthScores.dispatch, color: 'bg-purple-500' },
              { label: 'Exception Mgmt', score: healthScores.exceptions, color: 'bg-rose-500' }
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-bold text-white">{item.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800">
                  <div className={`h-1.5 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Recommendations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-lg bg-indigo-500/10 p-2"><Target className="h-5 w-5 text-indigo-400" /></div>
            <div>
              <h3 className="text-sm font-bold text-white">Top 3 AI Recommendations</h3>
              <p className="text-xs text-slate-400">Highest-impact actions right now</p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingRecs.slice(0, 3).map((rec, idx) => (
              <div
                key={rec.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{rec.actionText}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rec.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {rec.impact} Impact
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {rec.confidenceScore}% Confidence
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => applyRecommendation(rec.id)}
                    className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}

            {pendingRecs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheck className="h-10 w-10 text-emerald-400/50 mb-3" />
                <p className="text-sm font-semibold text-slate-300">All recommendations applied!</p>
                <p className="text-xs text-slate-500">Warehouse operating at optimal efficiency.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
