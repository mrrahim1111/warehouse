import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, BrainCircuit, ArrowDown, CheckCircle2, Clock, User } from 'lucide-react';

export const ExceptionsView: React.FC = () => {
  const { exceptions, resolveException } = useWarehouse();

  const activeExceptions = exceptions.filter(e => e.status !== 'Resolved');

  // Hero Exception -> Decision -> Resolution Flow for EXP-801
  const heroException = exceptions.find(e => e.id === 'EXP-801');

  return (
    <div className="space-y-6">
      {/* Hero Decision Flow for EXP-801 */}
      {heroException && heroException.status !== 'Resolved' && (
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-slate-900/60 p-6">
          <h3 className="text-sm font-extrabold text-white mb-5 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
            EXCEPTION → AI DECISION → RESOLUTION FLOW
          </h3>

          <div className="space-y-4">
            {/* Step 1: Exception */}
            <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">EXCEPTION</span>
                <span className="text-xs font-bold text-white">{heroException.id} — {heroException.orderId}</span>
              </div>
              <p className="text-xs text-slate-300">Required: <span className="font-bold text-white">10 units</span> • Available: <span className="font-bold text-red-400">7 units</span></p>
              <p className="text-[11px] text-slate-400 mt-1">{heroException.problem}</p>
            </div>

            <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-cyan-500" /></div>

            {/* Step 2: AI Decision */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">AI DECISION</span>
              </div>
              <p className="text-xs text-white font-semibold mb-1">{heroException.aiAnalysis}</p>
              <p className="text-[11px] text-cyan-300">Recommendation: {heroException.recommendedResolution}</p>
            </div>

            <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-cyan-500" /></div>

            {/* Step 3: Resolution */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">RESOLUTION</span>
              </div>
              <p className="text-xs text-white">7 units allocated. 3-unit shortage exception tracked. Replenishment recommendation generated.</p>
            </div>

            <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-cyan-500" /></div>

            {/* Step 4: Result */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">RESULT</span>
              </div>
              <p className="text-xs text-white">Critical order partially fulfilled. Lower-priority order temporarily delayed. SLA breach risk reduced from 98% to 22%.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => resolveException(heroException.id)}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" /> Resolve Exception
            </button>
            <button className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800">
              Assign
            </button>
            <button className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-950/40">
              Escalate
            </button>
          </div>
        </div>
      )}

      {/* All Active Exceptions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2"><AlertTriangle className="h-5 w-5 text-amber-400" /></div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Exceptions ({activeExceptions.length})</h3>
              <p className="text-xs text-slate-400">Exceptions requiring resolution</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {activeExceptions.map(exc => (
            <div key={exc.id} className="p-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{exc.id}</span>
                    <StatusBadge type="priority" value={exc.priority} size="sm" />
                    <StatusBadge type="exception" value={exc.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400">Order: <span className="text-cyan-400">{exc.orderId}</span> • Type: <span className="text-white">{exc.type}</span></p>
                </div>
                {exc.assignedEmployeeName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <User className="h-3 w-3" /> {exc.assignedEmployeeName}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-3 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <p className="text-slate-400 mb-1 font-semibold">Problem</p>
                  <p className="text-white">{exc.problem}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <p className="text-slate-400 mb-1 font-semibold">Impact</p>
                  <p className="text-white">{exc.impact}</p>
                </div>
              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-3 mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-[11px] font-bold text-cyan-300">AI Analysis & Recommended Resolution</span>
                </div>
                <p className="text-[11px] text-slate-300 mb-1">{exc.aiAnalysis}</p>
                <p className="text-[11px] text-emerald-300">→ {exc.recommendedResolution}</p>
              </div>

              {/* Timeline */}
              <div className="mb-3">
                <p className="text-[11px] font-bold text-slate-400 mb-1.5">Timeline</p>
                <div className="space-y-1">
                  {exc.timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <Clock className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="text-slate-500 font-mono">{t.timestamp}</span>
                      <span className="text-slate-300">{t.action}</span>
                      <span className="text-slate-500">— {t.author}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => resolveException(exc.id)}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition-all"
                >
                  Resolve
                </button>
                <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-800">
                  Assign
                </button>
                <button className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-[11px] font-bold text-amber-400 hover:bg-amber-950/20">
                  Escalate
                </button>
              </div>
            </div>
          ))}

          {activeExceptions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500/40 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No critical exceptions detected.</p>
              <p className="text-xs text-slate-500">With current inventory levels, no immediate operational risk exists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
