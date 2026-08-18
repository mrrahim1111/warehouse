import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { BrainCircuit, Zap, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const AIDecisionCenterView: React.FC = () => {
  const { aiRecommendations, applyRecommendation } = useWarehouse();
  const pending = aiRecommendations.filter(r => !r.applied);
  const applied = aiRecommendations.filter(r => r.applied);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/30 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500 blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-wide text-white">AI Decision Command Center</h3>
            <p className="text-xs text-indigo-300/70">{pending.length} pending recommendations • {applied.length} applied today</p>
          </div>
        </div>
      </div>

      {/* Pending Recommendations */}
      <div className="space-y-4">
        {pending.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/20 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl px-3 py-1.5 text-xs font-bold border ${
                  rec.category === 'Allocation' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                  rec.category === 'Capacity' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>{rec.category}</div>
                <h4 className="text-sm font-bold text-white">{rec.title}</h4>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border ${
                  rec.impact === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  rec.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>{rec.impact} Impact</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4">{rec.actionText}</p>

            {/* Confidence Score */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Confidence Score</span>
                <span className="text-lg font-black text-emerald-400">{rec.confidenceScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 mb-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all" style={{ width: `${rec.confidenceScore}%` }} />
              </div>
              <p className="text-[11px] text-slate-400 italic">
                "High confidence because deadline, stock availability, customer priority, and historical fulfillment patterns all indicate the same recommended action."
              </p>
            </div>

            {/* Decision Explanation */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">WHY THIS IS RECOMMENDED</span>
              </div>
              <ul className="space-y-1.5">
                {rec.explanation.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decision Impact (Before/After) */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-center">
                <p className="text-[10px] text-slate-400 mb-1">BEFORE</p>
                <p className="text-sm font-bold text-red-400">HIGH RISK</p>
              </div>
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-3 text-center">
                <p className="text-[10px] text-slate-400 mb-1">ACTION</p>
                <p className="text-sm font-bold text-cyan-400">{rec.category === 'Allocation' ? 'Allocate Stock' : rec.category === 'Capacity' ? 'Redistribute' : 'Reorder'}</p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3 text-center">
                <p className="text-[10px] text-slate-400 mb-1">AFTER</p>
                <p className="text-sm font-bold text-emerald-400">MITIGATED</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyRecommendation(rec.id)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
              >
                <Zap className="h-3.5 w-3.5" /> Apply
              </button>
              <button className="rounded-xl border border-red-500/30 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/20 transition-all">
                <XCircle className="h-3.5 w-3.5 inline mr-1" /> Reject
              </button>
              <button className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Applied Recommendations */}
      {applied.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5">
          <h3 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Applied Recommendations ({applied.length})
          </h3>
          <div className="space-y-2">
            {applied.map(rec => (
              <div key={rec.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-white font-semibold">{rec.title}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">APPLIED ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && applied.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShieldCheck className="h-14 w-14 text-emerald-500/30 mb-3" />
          <p className="text-sm font-semibold text-slate-300">All AI decisions processed!</p>
          <p className="text-xs text-slate-500">The warehouse is operating at peak efficiency.</p>
        </div>
      )}
    </div>
  );
};
