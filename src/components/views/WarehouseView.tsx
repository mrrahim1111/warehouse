import React, { useState } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { BrainCircuit, Users, Package, AlertTriangle, Map, Zap } from 'lucide-react';

export const WarehouseView: React.FC = () => {
  const { zones, rerouteZoneB } = useWarehouse();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  
  const zoneDetail = selectedZone ? zones.find(z => z.code === selectedZone) : null;

  const getHeatColor = (score: number) => {
    if (score >= 80) return 'from-red-600/30 to-red-900/20 border-red-500/40';
    if (score >= 50) return 'from-amber-600/20 to-amber-900/10 border-amber-500/30';
    return 'from-emerald-600/10 to-emerald-900/5 border-emerald-500/20';
  };

  const getCongestionBg = (level: string) => {
    if (level === 'Severe') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (level === 'High') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (level === 'Medium') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const getCongestionEmoji = (level: string) => {
    if (level === 'Severe') return '🔴 Congested';
    if (level === 'High') return '🟠 High Activity';
    if (level === 'Medium') return '🟡 Medium Activity';
    return '🟢 Normal';
  };

  return (
    <div className="space-y-6">
      {/* Warehouse Visual Layout */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2"><Map className="h-5 w-5 text-cyan-400" /></div>
            <div>
              <h3 className="text-sm font-bold text-white">Warehouse Layout & Activity Heatmap</h3>
              <p className="text-xs text-slate-400">Austin Main Hub (TX-01) • Live Traffic View</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-red-500/50" /> High Traffic</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-amber-500/50" /> Medium</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-emerald-500/50" /> Low</div>
          </div>
        </div>

        {/* Warehouse Grid Layout */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1: Storage Zones */}
          {zones.filter(z => ['ZA', 'ZB', 'ZC', 'ZD'].includes(z.code)).map(zone => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone.code)}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-b p-4 transition-all hover:scale-[1.02] cursor-pointer ${getHeatColor(zone.heatmapScore)} ${zone.heatmapScore >= 80 ? 'animate-pulse-glow' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-white">{zone.code}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getCongestionBg(zone.congestionLevel)}`}>
                  {zone.congestionLevel}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2">ZONE {zone.code.replace('Z', '')} {getCongestionEmoji(zone.congestionLevel)}</h4>
              <p className="text-[10px] text-slate-400 mb-3">{zone.category}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center rounded-lg bg-slate-900/60 p-1.5">
                  <Package className="h-3 w-3 text-slate-400 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-white">{zone.totalItemsCount}</p>
                  <p className="text-[8px] text-slate-500">Items</p>
                </div>
                <div className="text-center rounded-lg bg-slate-900/60 p-1.5">
                  <Users className="h-3 w-3 text-slate-400 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-white">{zone.activeWorkersCount}</p>
                  <p className="text-[8px] text-slate-500">Workers</p>
                </div>
                <div className="text-center rounded-lg bg-slate-900/60 p-1.5">
                  <AlertTriangle className="h-3 w-3 text-slate-400 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-white">{zone.pendingPicksCount}</p>
                  <p className="text-[8px] text-slate-500">Picks</p>
                </div>
                <div className="text-center rounded-lg bg-slate-900/60 p-1.5">
                  <Zap className="h-3 w-3 text-slate-400 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-white">{zone.efficiencyRate}%</p>
                  <p className="text-[8px] text-slate-500">Efficiency</p>
                </div>
              </div>

              {/* Heatmap intensity bar */}
              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-slate-800">
                  <div
                    className={`h-1.5 rounded-full transition-all ${zone.heatmapScore >= 80 ? 'bg-red-500' : zone.heatmapScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${zone.heatmapScore}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">Traffic Score: {zone.heatmapScore}/100</p>
              </div>
            </div>
          ))}

          {/* Row 2: Operational Zones */}
          {zones.filter(z => ['PK', 'QC', 'DS', 'RC'].includes(z.code)).map(zone => (
            <div
              key={zone.id}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-b p-4 transition-all hover:scale-[1.02] cursor-pointer ${getHeatColor(zone.heatmapScore)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-white">{zone.code}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getCongestionBg(zone.congestionLevel)}`}>
                  {zone.congestionLevel}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{zone.name.split(' - ')[0]}</h4>
              <p className="text-[10px] text-slate-400 mb-2">{zone.category}</p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-slate-400">Workers: <span className="font-bold text-white">{zone.activeWorkersCount}</span></span>
                <span className="text-slate-400">Queue: <span className="font-bold text-white">{zone.pendingPicksCount}</span></span>
                <span className="text-slate-400">Eff: <span className="font-bold text-white">{zone.efficiencyRate}%</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone B Congestion AI Alert */}
      {zones.find(z => z.code === 'ZB' && z.congestionLevel === 'Severe') && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-red-500/20 p-2"><AlertTriangle className="h-5 w-5 text-red-400" /></div>
            <div>
              <h3 className="text-sm font-bold text-red-300">CONGESTION ALERT — Zone B</h3>
              <p className="text-xs text-slate-400">Heavy Machinery aisle experiencing severe picking congestion</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 mb-3">
            <p className="text-xs text-slate-300 mb-2">
              <strong className="text-white">Reason:</strong> 47 active picking tasks concentrated in Zone B aisle B2. Worker density causes 4.2 min average delay per pick.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300">AI RECOMMENDATION</span>
            </div>
            <p className="text-xs text-slate-300">
              "Redirect 12 pending picking tasks through Zone C bypass aisle to reduce congestion by 34%."
            </p>
          </div>
          <button
            onClick={rerouteZoneB}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          >
            Apply Reroute Recommendation
          </button>
        </div>
      )}

      {/* Zone Detail Modal Overlay */}
      {zoneDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedZone(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">ZONE {zoneDetail.code.replace('Z', '')} {getCongestionEmoji(zoneDetail.congestionLevel)}</h3>
              <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400 mb-1">Active Tasks</p>
                <p className="text-xl font-bold text-white">{zoneDetail.pendingPicksCount + 12}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400 mb-1">Capacity</p>
                <p className="text-xl font-bold text-white">{zoneDetail.heatmapScore}%</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400 mb-1">Avg. Picking Time</p>
                <p className="text-xl font-bold text-white">{zoneDetail.congestionLevel === 'Severe' ? '8.4' : '2.1'} min</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400 mb-1">Workers</p>
                <p className="text-xl font-bold text-white">{zoneDetail.activeWorkersCount}</p>
              </div>
            </div>

            {zoneDetail.congestionLevel === 'Severe' && (
              <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="h-5 w-5 text-red-400" />
                  <span className="text-sm font-bold text-red-300">AI Recommendation</span>
                </div>
                <p className="text-sm text-slate-300">
                  Move 2 workers from Zone D.
                </p>
                <button
                  onClick={() => { rerouteZoneB(); setSelectedZone(null); }}
                  className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                >
                  Apply Recommendation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
