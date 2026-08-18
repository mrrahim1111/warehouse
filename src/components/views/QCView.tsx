import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const QCView: React.FC = () => {
  const { qcInspections, passQCInspection, failQCInspection } = useWarehouse();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 p-4 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2"><ShieldCheck className="h-5 w-5 text-emerald-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Quality Check Inspections</h3>
            <p className="text-xs text-slate-400">{qcInspections.length} inspections in queue</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {qcInspections.map(qc => (
            <div key={qc.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{qc.id}</span>
                    <span className="text-xs text-slate-400">→ {qc.orderId}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      qc.status === 'Passed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      qc.status === 'Failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      qc.status === 'Inspecting' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>{qc.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Inspector: <span className="text-emerald-400 font-semibold">{qc.inspectorName || 'Unassigned'}</span>
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {[
                  { label: 'Correct SKU', passed: qc.checks.correctSku },
                  { label: 'Correct Qty', passed: qc.checks.correctQuantity },
                  { label: 'Product Condition', passed: qc.checks.productCondition },
                  { label: 'Packaging Condition', passed: qc.checks.packagingCondition },
                  { label: 'Label Accuracy', passed: qc.checks.labelAccuracy }
                ].map(check => (
                  <div key={check.label} className={`rounded-lg border p-3 text-center ${
                    check.passed ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-red-500/30 bg-red-950/10'
                  }`}>
                    {check.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                    )}
                    <p className="text-[11px] font-semibold text-white">{check.label}</p>
                    <p className={`text-[10px] mt-0.5 ${check.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {check.passed ? 'PASS' : 'FAIL'}
                    </p>
                  </div>
                ))}
              </div>

              {qc.notes && (
                <p className="text-[11px] text-slate-400 mb-3 italic">Notes: {qc.notes}</p>
              )}

              {/* Action Buttons */}
              {qc.status === 'Inspecting' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => passQCInspection(qc.orderId)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Pass
                  </button>
                  <button
                    onClick={() => failQCInspection(qc.orderId, 'Visual inspection compliance failure')}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-5 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 transition-all"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Fail
                  </button>
                  <button className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 px-5 py-2 text-xs font-bold text-amber-400 hover:bg-amber-950/40 transition-all">
                    <AlertTriangle className="h-3.5 w-3.5" /> Report Damage
                  </button>
                </div>
              )}
            </div>
          ))}

          {qcInspections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldCheck className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No pending inspections</p>
              <p className="text-xs text-slate-500">Quality checks appear when orders reach QC stage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
