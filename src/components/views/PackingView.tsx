import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { StatusBadge } from '../common/StatusBadge';
import { Box, CheckCircle2, AlertTriangle, Weight, Tag } from 'lucide-react';

export const PackingView: React.FC = () => {
  const { packingTasks } = useWarehouse();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 p-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/10 p-2"><Box className="h-5 w-5 text-purple-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Packing Workflow</h3>
            <p className="text-xs text-slate-400">{packingTasks.length} packages in progress</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {packingTasks.map(task => {
            const stages = ['Picked', 'Packing', 'Weight Check', 'Label Generated', 'Ready'];
            const currentIdx = stages.indexOf(task.status);
            return (
              <div key={task.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{task.id}</span>
                      <span className="text-xs text-slate-400">→ {task.orderId}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Packer: <span className="text-purple-400 font-semibold">{task.packerName || 'Unassigned'}</span> •
                      Shipping: <span className="text-white">{task.shippingMethod}</span>
                    </p>
                  </div>
                  <StatusBadge type="stage" value={task.status} size="md" />
                </div>

                {/* Packing Pipeline Progress */}
                <div className="flex items-center gap-1 mb-4">
                  {stages.map((stage, idx) => (
                    <React.Fragment key={stage}>
                      <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border ${
                        idx < currentIdx ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        idx === currentIdx ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-md' :
                        'bg-slate-900 border-slate-800 text-slate-500'
                      }`}>
                        {idx < currentIdx ? <CheckCircle2 className="h-3 w-3" /> : null}
                        {stage}
                      </div>
                      {idx < stages.length - 1 && <span className={`text-xs ${idx < currentIdx ? 'text-emerald-500' : 'text-slate-700'}`}>→</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Validation Checks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-center">
                    <Box className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Packages</p>
                    <p className="text-sm font-bold text-white">{task.packageCount}</p>
                  </div>
                  <div className={`rounded-lg border p-3 text-center ${task.weightMatch ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-red-500/30 bg-red-950/10'}`}>
                    <Weight className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Weight</p>
                    <p className="text-sm font-bold text-white">{task.actualWeightKg}kg</p>
                    {task.weightMatch ? (
                      <p className="text-[10px] text-emerald-400 mt-0.5">✓ Match ({task.expectedWeightKg}kg)</p>
                    ) : (
                      <p className="text-[10px] text-red-400 mt-0.5">✗ Mismatch! Expected {task.expectedWeightKg}kg</p>
                    )}
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-center">
                    <Tag className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Dimensions</p>
                    <p className="text-sm font-bold text-white">{task.dimensionsCm} cm</p>
                  </div>
                  <div className={`rounded-lg border p-3 text-center ${task.itemCheckPassed ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-red-500/30 bg-red-950/10'}`}>
                    <CheckCircle2 className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Item Check</p>
                    <p className={`text-sm font-bold ${task.itemCheckPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {task.itemCheckPassed ? 'PASSED' : 'FAILED'}
                    </p>
                  </div>
                </div>

                {!task.weightMatch && (
                  <div className="mt-3 rounded-lg border border-red-500/20 bg-red-950/20 p-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-[11px] text-red-300">
                      <strong>Warning:</strong> Package weight does not match expected value. Verify contents before generating shipping label.
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {packingTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Box className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No active packing tasks</p>
              <p className="text-xs text-slate-500">Packing tasks appear here when orders complete picking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
