import React, { useState } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { StatusBadge } from '../common/StatusBadge';
import { predictStockout } from '../../services/aiEngine';
import {
  Search, AlertTriangle, BrainCircuit
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, createReorder } = useWarehouse();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const categories = [...new Set(inventory.map(i => i.category))];
  const zones = [...new Set(inventory.map(i => i.warehouseZone))];

  const filtered = inventory.filter(i => {
    const matchSearch = search === '' || i.sku.toLowerCase().includes(search.toLowerCase()) || i.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    const matchZone = filterZone === 'all' || i.warehouseZone === filterZone;
    const matchCat = filterCategory === 'all' || i.category === filterCategory;
    return matchSearch && matchStatus && matchZone && matchCat;
  });

  const detailItem = selectedDetail ? inventory.find(i => i.sku === selectedDetail) : null;

  return (
    <div className="space-y-5">
      {/* Stockout Alerts Banner */}
      {inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock').length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-sm font-bold text-red-300">STOCKOUT RISK ALERTS</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock').map(item => {
              const pred = predictStockout(item);
              return (
                <div key={item.sku} className="rounded-lg border border-red-500/20 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{item.sku}</span>
                    <StatusBadge type="stock" value={item.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-300 mb-2">{item.productName}</p>
                  <p className="text-[11px] text-red-300 mb-2">{pred.aiAlert}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Available: <span className="font-bold text-white">{item.availableStock}</span></span>
                    <span className="text-[10px] text-slate-400">Demand: <span className="font-bold text-white">{item.dailyAvgDemand}/day</span></span>
                  </div>
                  <button
                    onClick={() => createReorder(item.sku, pred.recommendedReorderQty)}
                    className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 py-1.5 text-[11px] font-bold text-white shadow-sm hover:shadow-cyan-500/30 transition-all"
                  >
                    Create Purchase Recommendation ({pred.recommendedReorderQty} units)
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text" placeholder="Search SKU, product name..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/40"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none">
          <option value="all">All Statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Critical">Critical</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Overstock">Overstock</option>
        </select>
        <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none">
          <option value="all">All Zones</option>
          {zones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Reserved</th>
                <th className="px-4 py-3 font-semibold">Available</th>
                <th className="px-4 py-3 font-semibold">Reorder Lvl</th>
                <th className="px-4 py-3 font-semibold">Zone / Bin</th>
                <th className="px-4 py-3 font-semibold">Supplier</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Est. Days</th>
                <th className="px-4 py-3 font-semibold">AI Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(item => (
                <tr key={item.sku} className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => setSelectedDetail(item.sku)}>
                  <td className="px-4 py-3 font-bold text-white">{item.sku}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate">{item.productName}</td>
                  <td className="px-4 py-3 text-slate-400">{item.category}</td>
                  <td className="px-4 py-3 font-bold text-white">{item.currentStock}</td>
                  <td className="px-4 py-3 text-amber-400">{item.reservedStock}</td>
                  <td className="px-4 py-3">
                    <span className={item.availableStock <= 5 ? 'font-bold text-red-400' : 'text-emerald-400 font-bold'}>{item.availableStock}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.reorderLevel}</td>
                  <td className="px-4 py-3 text-slate-400">{item.warehouseZone} / {item.binLocation}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-[120px] truncate">{item.supplierName}</td>
                  <td className="px-4 py-3"><StatusBadge type="stock" value={item.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <span className={item.estimatedDaysRemaining <= 2 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                      {item.estimatedDaysRemaining}d
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">{item.aiForecast}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedDetail(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">{detailItem.sku} — Inventory Health</h3>
              <button onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Current Stock', value: detailItem.currentStock },
                { label: 'Daily Avg Demand', value: `${detailItem.dailyAvgDemand}/day` },
                { label: 'Reserved Stock', value: detailItem.reservedStock },
                { label: 'Available Stock', value: detailItem.availableStock },
                { label: 'Reorder Point', value: detailItem.reorderLevel },
                { label: 'Est. Days Remaining', value: detailItem.estimatedDaysRemaining },
                { label: 'Supplier Lead Time', value: '2-5 days' },
                { label: 'Recommended Reorder', value: detailItem.reorderQuantity }
              ].map(stat => (
                <div key={stat.label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-[11px] text-slate-400">{stat.label}</p>
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Stock Level Indicator */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">Stock Level</p>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    detailItem.currentStock <= detailItem.reorderLevel ? 'bg-red-500' :
                    detailItem.currentStock <= detailItem.reorderLevel * 2 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (detailItem.currentStock / (detailItem.reorderLevel * 3)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300">AI FORECAST</span>
              </div>
              <p className="text-[11px] text-slate-300">{detailItem.aiForecast}</p>
            </div>

            <button
              onClick={() => { createReorder(detailItem.sku, detailItem.reorderQuantity); setSelectedDetail(null); }}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
            >
              Create Purchase Recommendation ({detailItem.reorderQuantity} units)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
