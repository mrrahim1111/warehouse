import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { StatusBadge } from '../common/StatusBadge';
import { Truck, AlertTriangle, BrainCircuit, CheckCircle2 } from 'lucide-react';

import { LiveNavigationTracker } from '../common/LiveNavigationTracker';

export const DispatchView: React.FC = () => {
  const { shipments, dispatchShipment } = useWarehouse();

  return (
    <div className="space-y-6">
      {/* Live Navigation & Carrier GPS Tracker */}
      <LiveNavigationTracker />
      {/* Delay Risk Alerts */}
      {shipments.filter(s => s.delayRisk === 'Critical' || s.delayRisk === 'High').length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-sm font-bold text-red-300">DISPATCH DELAY RISK ALERTS</h3>
          </div>
          {shipments.filter(s => s.delayRisk === 'Critical' || s.delayRisk === 'High').map(s => (
            <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 mb-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs font-bold text-white">{s.id}</span>
                  <span className="text-xs text-slate-400 ml-2">→ {s.orderId} ({s.customerName})</span>
                </div>
                <StatusBadge type="delay" value={s.delayRisk} size="sm" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div><span className="text-slate-400">Expected Dispatch:</span> <span className="font-bold text-white">{s.expectedDispatchTime}</span></div>
                <div><span className="text-slate-400">Actual:</span> <span className="font-bold text-red-400">{s.actualDispatchTime || 'PENDING'}</span></div>
                <div><span className="text-slate-400">Courier:</span> <span className="font-bold text-white">{s.courier}</span></div>
                <div><span className="text-slate-400">Destination:</span> <span className="font-bold text-white">{s.destination}</span></div>
              </div>
              {s.delayReason && (
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[11px] font-bold text-cyan-300">AI RECOMMENDATION</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{s.delayReason}</p>
                </div>
              )}
              <button
                onClick={() => dispatchShipment(s.id)}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:shadow-emerald-500/30 transition-all"
              >
                Apply Recommendation & Dispatch
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Shipments Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 p-4 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2"><Truck className="h-5 w-5 text-emerald-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Dispatch Management</h3>
            <p className="text-xs text-slate-400">{shipments.length} shipments tracked</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="px-4 py-3 font-semibold">Shipment</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Courier</th>
                <th className="px-4 py-3 font-semibold">Tracking</th>
                <th className="px-4 py-3 font-semibold">Destination</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Expected</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Delay Risk</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{s.id}</td>
                  <td className="px-4 py-3 text-cyan-400">{s.orderId}</td>
                  <td className="px-4 py-3 text-slate-300">{s.customerName}</td>
                  <td className="px-4 py-3 text-slate-300">{s.courier}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{s.trackingId}</td>
                  <td className="px-4 py-3 text-slate-300">{s.destination}</td>
                  <td className="px-4 py-3"><StatusBadge type="priority" value={s.shippingPriority} size="sm" /></td>
                  <td className="px-4 py-3 text-slate-300">{s.expectedDispatchTime}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      s.status === 'Dispatched' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      s.status === 'Ready' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge type="delay" value={s.delayRisk} size="sm" /></td>
                  <td className="px-4 py-3">
                    {s.status !== 'Dispatched' && (
                      <button
                        onClick={() => dispatchShipment(s.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition-all"
                      >
                        Dispatch
                      </button>
                    )}
                    {s.status === 'Dispatched' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
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
