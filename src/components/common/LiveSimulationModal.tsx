import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import {
  X, ChevronRight, ShoppingBag, BrainCircuit, PackageSearch,
  Zap, CheckSquare, Box, ShieldCheck, Truck
} from 'lucide-react';

const STEP_ICONS: Record<string, React.ReactNode> = {
  order: <ShoppingBag className="h-5 w-5 text-cyan-400" />,
  ai: <BrainCircuit className="h-5 w-5 text-indigo-400" />,
  inventory: <PackageSearch className="h-5 w-5 text-amber-400" />,
  pick: <CheckSquare className="h-5 w-5 text-emerald-400" />,
  pack: <Box className="h-5 w-5 text-purple-400" />,
  qc: <ShieldCheck className="h-5 w-5 text-green-400" />,
  dispatch: <Truck className="h-5 w-5 text-cyan-400" />,
};

const STEP_COLORS: Record<string, string> = {
  order: 'border-cyan-500/30 bg-cyan-950/20',
  ai: 'border-indigo-500/30 bg-indigo-950/20',
  inventory: 'border-amber-500/30 bg-amber-950/20',
  pick: 'border-emerald-500/30 bg-emerald-950/20',
  pack: 'border-purple-500/30 bg-purple-950/20',
  qc: 'border-green-500/30 bg-green-950/20',
  dispatch: 'border-cyan-500/30 bg-cyan-950/20',
};

export const LiveSimulationModal: React.FC = () => {
  const {
    isLiveSimOpen, setIsLiveSimOpen,
    isSimulating, currentSimStep, simSteps,
    nextSimStep, stopLiveSimulation
  } = useWarehouse();

  if (!isLiveSimOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">LIVE WAREHOUSE SIMULATION</h3>
              <p className="text-[11px] text-slate-400">Order ORD-1042 → Tesla Gigafactory Express Air</p>
            </div>
          </div>
          <button onClick={() => { stopLiveSimulation(); setIsLiveSimOpen(false); }} className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-white transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400">Progress</span>
            <span className="text-[11px] font-bold text-cyan-400">{currentSimStep} / {simSteps.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${(currentSimStep / simSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Simulation Steps */}
        <div className="px-6 py-4 space-y-3">
          {simSteps.map((step, idx) => {
            const isActive = idx + 1 === currentSimStep;
            const isPast = idx + 1 < currentSimStep;
            const isFuture = idx + 1 > currentSimStep;

            return (
              <div
                key={step.stepIndex}
                className={`rounded-xl border p-4 transition-all duration-500 ${
                  isActive
                    ? `${STEP_COLORS[step.type]} shadow-lg animate-fadeIn`
                    : isPast
                    ? 'border-slate-800/60 bg-slate-950/30 opacity-70'
                    : 'border-slate-800/30 bg-slate-950/20 opacity-30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isPast ? 'bg-emerald-500/20' : isActive ? 'bg-white/10' : 'bg-slate-800/60'
                  }`}>
                    {isPast ? (
                      <span className="text-emerald-400 text-sm">✓</span>
                    ) : (
                      STEP_ICONS[step.type] || <Zap className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-xs font-bold ${isFuture ? 'text-slate-500' : 'text-white'}`}>
                        Step {step.stepIndex}: {step.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
                    </div>
                    <p className={`text-[11px] mb-1 ${isFuture ? 'text-slate-600' : 'text-slate-300'}`}>{step.description}</p>
                    {!isFuture && (
                      <p className="text-[11px] text-slate-400 italic">{step.detail}</p>
                    )}
                    {isActive && step.affectedEntity && (
                      <div className="mt-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                        Affected: {step.affectedEntity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="sticky bottom-0 border-t border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => { stopLiveSimulation(); setIsLiveSimOpen(false); }}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
          >
            Close Simulation
          </button>

          {isSimulating && currentSimStep < simSteps.length ? (
            <button
              onClick={nextSimStep}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
            >
              Next Step <ChevronRight className="h-4 w-4" />
            </button>
          ) : currentSimStep >= simSteps.length ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="text-lg">🎉</span> Simulation Complete — SLA Delivered!
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
