import React, { useState } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search, Clock, Package, BrainCircuit, AlertTriangle,
  CheckCircle2, ArrowRight
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders, inventory, selectedOrderId, setSelectedOrderId,
    allocateInventory
  } = useWarehouse();

  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');

  const filtered = orders.filter(o => {
    const matchesSearch = search === '' || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'all' || o.priority === filterPriority;
    const matchesStage = filterStage === 'all' || o.stage === filterStage;
    return matchesSearch && matchesPriority && matchesStage;
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;
  const topCriticalOrder = [...orders].sort((a, b) => b.priorityScore - a.priorityScore)[0];

  const stages = ['Created', 'Priority Assigned', 'Inventory Checked', 'Stock Allocated', 'Picking', 'Packing', 'Quality Check', 'Ready for Dispatch', 'Dispatched', 'Delivered'];

  if (selectedOrder) {
    const stageIndex = stages.indexOf(selectedOrder.stage);
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedOrderId(null)} className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
          ← Back to Orders
        </button>

        {/* Order Header */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-black text-white">{selectedOrder.id}</h2>
                <StatusBadge type="priority" value={selectedOrder.priority} size="lg" />
                <StatusBadge type="stage" value={selectedOrder.stage} size="lg" />
              </div>
              <p className="text-sm text-slate-300">{selectedOrder.customerName} • <span className="text-cyan-400">{selectedOrder.customerTier}</span></p>
              <p className="text-xs text-slate-400 mt-1">Created: {selectedOrder.createdAt} • Value: ${selectedOrder.orderValue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{selectedOrder.priorityScore}<span className="text-lg text-slate-400">/100</span></div>
              <p className="text-xs text-slate-400">AI Priority Score</p>
            </div>
          </div>
        </div>

        {/* WHY THIS ORDER IS PRIORITIZED */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">WHY THIS ORDER IS PRIORITIZED</h3>
          </div>
          <div className="space-y-2">
            {selectedOrder.priorityFactors.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-sm font-bold text-indigo-400">
                  +{f.scoreContribution}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{f.name}</p>
                  <p className="text-[11px] text-slate-400">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items + Smart Allocation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Package className="h-4 w-4 text-cyan-400" /> Order Items & Inventory Allocation</h3>
          <div className="space-y-3">
            {selectedOrder.items.map(item => {
              const inv = inventory.find(i => i.sku === item.sku);
              const hasShortage = item.allocatedQty < item.requestedQty;
              return (
                <div key={item.sku} className={`rounded-xl border p-4 ${hasShortage ? 'border-red-500/30 bg-red-950/10' : 'border-slate-800 bg-slate-950/40'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">{item.sku} — {item.productName}</p>
                      <p className="text-[11px] text-slate-400">{item.zone} • {item.binLocation} • ${item.unitPrice}/unit</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="text-slate-400">Required</p>
                        <p className="font-bold text-white">{item.requestedQty}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Available</p>
                        <p className={`font-bold ${(inv?.availableStock ?? 0) < item.requestedQty ? 'text-red-400' : 'text-emerald-400'}`}>{inv?.availableStock ?? 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Allocated</p>
                        <p className="font-bold text-cyan-400">{item.allocatedQty}</p>
                      </div>
                      {hasShortage && (
                        <div className="text-center">
                          <p className="text-slate-400">Shortage</p>
                          <p className="font-bold text-red-400">{item.requestedQty - item.allocatedQty}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Smart Allocation Recommendation (Hero Scenario) */}
                  {hasShortage && (
                    <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-300">AI SMART ALLOCATION RECOMMENDATION</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-3">
                        "Allocate the available {inv?.availableStock ?? 0} units to {selectedOrder.id} because it has a critical delivery deadline. Reserve remaining inventory for high-priority orders and trigger replenishment for the {item.requestedQty - item.allocatedQty}-unit shortage."
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => allocateInventory(selectedOrder.id, item.sku, inv?.availableStock ?? 0)}
                          className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                        >
                          Apply Allocation
                        </button>
                        <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all">
                          Override Decision
                        </button>
                        <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all">
                          View Impact
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Order Timeline */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-cyan-400" /> Order Fulfillment Timeline</h3>
          <div className="relative flex flex-wrap items-center gap-1">
            {stages.map((stage, idx) => {
              const isCompleted = idx < stageIndex;
              const isCurrent = idx === stageIndex;
              return (
                <React.Fragment key={stage}>
                  <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold border transition-all ${
                    isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    isCurrent ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-900/20 animate-pulse' :
                    'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : isCurrent ? <div className="h-2 w-2 rounded-full bg-cyan-400" /> : <div className="h-2 w-2 rounded-full bg-slate-600" />}
                    {stage}
                  </div>
                  {idx < stages.length - 1 && <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${idx < stageIndex ? 'text-emerald-500' : 'text-slate-700'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation */}
        {selectedOrder.aiRecommendation && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300">AI Recommendation</h3>
            </div>
            <p className="text-xs text-slate-300">{selectedOrder.aiRecommendation}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* AI Priority Engine Banner */}
      {topCriticalOrder && !selectedOrder && (
        <div 
          className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 cursor-pointer hover:bg-red-950/30 transition-all shadow-lg shadow-red-900/10"
          onClick={() => setSelectedOrderId(topCriticalOrder.id)}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-red-500/20 p-2"><BrainCircuit className="h-5 w-5 text-red-400 animate-pulse" /></div>
            <div>
              <h3 className="text-sm font-bold text-red-300">🤖 AI Priority Engine Alert</h3>
              <p className="text-xs text-slate-400">Critical intervention required</p>
            </div>
          </div>
          
          <div className="rounded-xl border border-red-500/20 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{topCriticalOrder.id} — Priority {topCriticalOrder.priorityScore}/100 🔴</span>
            </div>
            <p className="text-sm font-bold text-red-300">
              💡 AI says: {topCriticalOrder.aiRecommendation || `Dispatch immediately — already ${Math.abs(topCriticalOrder.deadlineMinutesRemaining)} min overdue.`}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/40 transition-all"
          />
        </div>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterStage}
          onChange={e => setFilterStage(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none"
        >
          <option value="all">All Stages</option>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Tier</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Score</th>
                <th className="px-4 py-3 font-semibold">Deadline</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Shipping</th>
                <th className="px-4 py-3 font-semibold">Exception</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <td className="px-4 py-3 font-bold text-white">{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.customerName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold ${order.customerTier === 'Enterprise VIP' ? 'text-purple-400' : order.customerTier === 'Premium' ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {order.customerTier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">${order.orderValue.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge type="priority" value={order.priority} size="sm" /></td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${order.priorityScore >= 90 ? 'text-red-400' : order.priorityScore >= 75 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {order.priorityScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={order.deadlineMinutesRemaining < 0 ? 'text-red-400 font-bold' : order.deadlineMinutesRemaining <= 60 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {order.deadlineMinutesRemaining < 0 ? `OVERDUE ${Math.abs(order.deadlineMinutesRemaining)}m` : `${order.deadlineMinutesRemaining}m`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{order.items.length} SKUs</td>
                  <td className="px-4 py-3"><StatusBadge type="stage" value={order.stage} size="sm" /></td>
                  <td className="px-4 py-3 text-slate-300 text-[11px]">{order.shippingMethod}</td>
                  <td className="px-4 py-3">
                    {order.hasException ? <AlertTriangle className="h-4 w-4 text-red-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500/40" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
