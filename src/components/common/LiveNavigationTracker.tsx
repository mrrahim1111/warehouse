import React, { useState } from 'react';
import type { PickerLocationTrack, CarrierGpsTrack } from '../../types/warehouse';
import { INITIAL_PICKER_TRACKS, INITIAL_CARRIER_TRACKS } from '../../data/mockData';
import {
  Navigation, Truck, MapPin, Compass, Play, RotateCcw,
  AlertTriangle, ShieldCheck, Zap, Activity
} from 'lucide-react';

export const LiveNavigationTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'picker' | 'carrier'>('picker');
  const [pickerTracks, setPickerTracks] = useState<PickerLocationTrack[]>(INITIAL_PICKER_TRACKS);
  const [carrierTracks] = useState<CarrierGpsTrack[]>(INITIAL_CARRIER_TRACKS);
  const [selectedPickerId, setSelectedPickerId] = useState<string>('EMP-01');
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>('SHP-901');

  const selectedPicker = pickerTracks.find(p => p.pickerId === selectedPickerId) || pickerTracks[0];
  const selectedCarrier = carrierTracks.find(c => c.shipmentId === selectedCarrierId) || carrierTracks[0];

  // Action to advance picker location along route (Simulate indoor movement)
  const advancePickerStep = (pickerId: string) => {
    setPickerTracks(prev =>
      prev.map(p => {
        if (p.pickerId === pickerId) {
          const nextRemaining = Math.max(0, p.remainingDistanceMeters - 12);
          const updatedWaypoints = p.waypoints.map((wp, idx) => {
            if (idx === 1 && nextRemaining < 20) return { ...wp, completed: true };
            if (idx === 2 && nextRemaining === 0) return { ...wp, completed: true };
            return wp;
          });
          const newX = Math.min(80, p.currentX + 18);
          const newY = Math.min(85, p.currentY + 15);
          return {
            ...p,
            currentX: newX,
            currentY: newY,
            remainingDistanceMeters: nextRemaining,
            waypoints: updatedWaypoints
          };
        }
        return p;
      })
    );
  };

  const resetPickerTrack = (pickerId: string) => {
    const original = INITIAL_PICKER_TRACKS.find(p => p.pickerId === pickerId);
    if (original) {
      setPickerTracks(prev => prev.map(p => p.pickerId === pickerId ? { ...original } : p));
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Live Navigation & GPS Route Tracker</h3>
            <p className="text-xs text-slate-400">Real-time indoor picker positioning & carrier transit GPS telemetry</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'picker'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> Indoor Picker GPS
          </button>
          <button
            onClick={() => setActiveTab('carrier')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'carrier'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="h-3.5 w-3.5" /> Carrier Transit GPS
          </button>
        </div>
      </div>

      {/* TAB 1: INDOOR PICKER NAVIGATION */}
      {activeTab === 'picker' && selectedPicker && (
        <div className="space-y-6">
          {/* Picker Selector Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-2">Active Pickers:</span>
            {pickerTracks.map(p => (
              <button
                key={p.pickerId}
                onClick={() => setSelectedPickerId(p.pickerId)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedPickerId === p.pickerId
                    ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                {p.pickerName} ({p.orderId})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual 2D Indoor Floorplan Map */}
            <div className="lg:col-span-2 relative rounded-2xl border border-slate-800 bg-slate-950/80 p-5 overflow-hidden min-h-[340px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Indoor Map — {selectedPicker.currentZone} Floorplan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400">Position: ({selectedPicker.currentX}m, {selectedPicker.currentY}m)</span>
                  <button
                    onClick={() => advancePickerStep(selectedPicker.pickerId)}
                    className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-cyan-500 shadow-sm"
                  >
                    <Play className="h-3 w-3 fill-current" /> Move Step
                  </button>
                  <button
                    onClick={() => resetPickerTrack(selectedPicker.pickerId)}
                    className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Warehouse Floorplan Grid SVG Overlay */}
              <div className="relative h-64 w-full rounded-xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 overflow-hidden">
                {/* Aisle Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 p-3 opacity-20">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="rounded border border-dashed border-cyan-500/40 bg-cyan-500/5 flex items-center justify-center text-[9px] text-cyan-400/40 font-mono">
                      Aisle {i + 1}
                    </div>
                  ))}
                </div>

                {/* SVG Route Line */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none">
                  <polyline
                    points={selectedPicker.waypoints.map(wp => `${wp.x}%,${wp.y}%`).join(' ')}
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                </svg>

                {/* Waypoint Markers */}
                {selectedPicker.waypoints.map((wp, idx) => (
                  <div
                    key={idx}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
                    style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                  >
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shadow-lg border ${
                      wp.completed
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-indigo-600 text-white border-indigo-400'
                    }`}>
                      {wp.completed ? '✓' : idx + 1}
                    </div>
                    <span className="hidden sm:inline-block rounded bg-slate-900/90 border border-slate-700 px-2 py-0.5 text-[9px] font-bold text-slate-200 shadow">
                      {wp.label}
                    </span>
                  </div>
                ))}

                {/* Live Picker Location Pin */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 z-10"
                  style={{ left: `${selectedPicker.currentX}%`, top: `${selectedPicker.currentY}%` }}
                >
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-40 animate-ping" />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-lg shadow-cyan-500/50 text-white border border-white">
                      <Navigation className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Picker: <strong className="text-white">{selectedPicker.pickerName}</strong></span>
                <span>Speed: <strong className="text-cyan-400">{selectedPicker.speedMps} m/s</strong></span>
                <span>Distance Remaining: <strong className="text-emerald-400">{selectedPicker.remainingDistanceMeters}m</strong></span>
              </div>
            </div>

            {/* Turn-by-Turn Turn Directions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-400" /> Turn-by-Turn Guidance
              </h4>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {selectedPicker.turnByTurn.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
                  <Zap className="h-3.5 w-3.5" /> AI Route Optimization
                </div>
                <p className="text-[11px] text-slate-400">
                  Route avoids Zone B congestion corridor. Walking time reduced by 1.8 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CARRIER TRANSIT GPS TRACKER */}
      {activeTab === 'carrier' && selectedCarrier && (
        <div className="space-y-6">
          {/* Carrier Selector Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-2">Active Carrier Transit:</span>
            {carrierTracks.map(c => (
              <button
                key={c.shipmentId}
                onClick={() => setSelectedCarrierId(c.shipmentId)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCarrierId === c.shipmentId
                    ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Truck className="h-3.5 w-3.5 text-cyan-400" />
                {c.courier} ({c.shipmentId})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GPS Telemetry Header */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedCarrier.courier} — {selectedCarrier.trackingNumber}</h4>
                  <p className="text-xs text-slate-400">{selectedCarrier.vehicleType} • Driver: <span className="text-white font-semibold">{selectedCarrier.driverName}</span></p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    IN TRANSIT
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">ETA: <strong className="text-white">{selectedCarrier.etaMinutes} min</strong></p>
                </div>
              </div>

              {/* Live Telemetry Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <p className="text-[10px] text-slate-400">Current Speed</p>
                  <p className="text-base font-black text-cyan-400">{selectedCarrier.speedKmh} km/h</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <p className="text-[10px] text-slate-400">Latitude / Longitude</p>
                  <p className="text-xs font-mono font-bold text-white">{selectedCarrier.lat.toFixed(4)}, {selectedCarrier.lng.toFixed(4)}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <p className="text-[10px] text-slate-400">Destination</p>
                  <p className="text-xs font-bold text-emerald-400 truncate">{selectedCarrier.destination}</p>
                </div>
              </div>

              {/* Progress Checkpoints */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 mb-3">Checkpoints Progress</h5>
                <div className="relative space-y-3">
                  {selectedCarrier.checkpoints.map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        cp.completed ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {cp.completed ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 p-2.5 flex items-center justify-between text-xs">
                        <span className={cp.completed ? 'text-white font-semibold' : 'text-slate-400'}>{cp.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{cp.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCarrier.weatherAlert && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-300">{selectedCarrier.weatherAlert}</p>
                </div>
              )}
            </div>

            {/* Carrier Summary Sidebar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Carrier Compliance
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="text-slate-400">Shipment ID</span>
                  <span className="font-bold text-cyan-400">{selectedCarrier.shipmentId}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="text-slate-400">Origin</span>
                  <span className="font-semibold text-white">{selectedCarrier.origin}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="text-slate-400">Hot-Shot Carrier</span>
                  <span className="font-semibold text-white">{selectedCarrier.courier}</span>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                  <Activity className="h-3.5 w-3.5" /> Live EDI Telemetry Signal
                </div>
                <p className="text-[11px] text-slate-400">
                  Telemetry pinged 12s ago via Satellite EDI link. Signal strength: 99.8%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
