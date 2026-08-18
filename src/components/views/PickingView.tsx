import React, { useState } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { StatusBadge } from '../common/StatusBadge';
import { CheckSquare, Navigation, BrainCircuit, AlertTriangle } from 'lucide-react';

import { LiveNavigationTracker } from '../common/LiveNavigationTracker';

export const PickingView: React.FC = () => {
  const { pickingTasks, reportPickingError } = useWarehouse();
  const [errorOrderId, setErrorOrderId] = useState<string | null>(null);
  const [errorType, setErrorType] = useState('Missing item');

  return (
    <div className="space-y-6">
      {/* Live Navigation Tracker */}
      <LiveNavigationTracker />
      {/* Picking Tasks */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 p-4 flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/10 p-2"><CheckSquare className="h-5 w-5 text-cyan-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Active Picking Tasks</h3>
            <p className="text-xs text-slate-400">{pickingTasks.length} tasks in progress</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {pickingTasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{task.id}</span>
                    <span className="text-xs text-slate-400">→ {task.orderId}</span>
                    <StatusBadge type="priority" value={task.priority} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Picker: <span className="text-cyan-400 font-semibold">{task.pickerName || 'Unassigned'}</span> • Zone: {task.zone} • Stage: <span className="text-white font-semibold">{task.stage}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-center">
                    <p className="text-slate-400">Distance</p>
                    <p className="font-bold text-white">{task.estimatedDistanceMeters}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">Time</p>
                    <p className="font-bold text-white">{Math.floor(task.estimatedTimeSeconds / 60)}m {task.estimatedTimeSeconds % 60}s</p>
                  </div>
                </div>
              </div>

              {/* AI Picking Route Optimizer */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300">AI OPTIMIZED PICKING ROUTE</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {task.route.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px]">
                        <span className="font-bold text-white">{step.location}</span>
                        <span className="text-slate-400 ml-1">({step.sku} × {step.qtyToPick})</span>
                      </div>
                      {idx < task.route.length - 1 && <span className="text-cyan-400 font-bold">→</span>}
                    </React.Fragment>
                  ))}
                  <span className="text-cyan-400 font-bold">→</span>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-[11px] text-emerald-400 font-bold">
                    Packing Station
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  <BrainCircuit className="h-3 w-3 text-cyan-400 inline mr-1" />
                  <strong className="text-cyan-300">Why this route?</strong> {task.routeJustification}
                </p>
              </div>

              {/* Report Picking Error */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setErrorOrderId(errorOrderId === task.orderId ? null : task.orderId)}
                  className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-[11px] font-bold text-red-400 hover:bg-red-950/40 transition-all"
                >
                  <AlertTriangle className="h-3 w-3 inline mr-1" /> Report Picking Error
                </button>
              </div>

              {errorOrderId === task.orderId && (
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-bold text-white mb-2">Report Error for {task.orderId}</p>
                  <select
                    value={errorType}
                    onChange={e => setErrorType(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none w-full mb-2"
                  >
                    <option>Missing item</option>
                    <option>Wrong item</option>
                    <option>Wrong quantity</option>
                    <option>Damaged item</option>
                  </select>
                  <button
                    onClick={() => {
                      reportPickingError(task.orderId, `${errorType} detected during picking route execution.`);
                      setErrorOrderId(null);
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-all"
                  >
                    Submit Error Report
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
