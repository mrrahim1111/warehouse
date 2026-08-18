import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { Users, MapPin, Clock, Activity, Star, AlertTriangle } from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees } = useWarehouse();

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <Users className="h-5 w-5 text-cyan-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{employees.length}</p>
          <p className="text-[10px] text-slate-400">Total Staff</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <Activity className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{employees.filter(e => e.status === 'Active').length}</p>
          <p className="text-[10px] text-slate-400">On-Shift</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <Star className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{(employees.reduce((sum, e) => sum + (e.efficiencyRating ?? e.productivityScore), 0) / (employees.length || 1)).toFixed(0)}%</p>
          <p className="text-[10px] text-slate-400">Avg Efficiency</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mx-auto mb-1.5" />
          <p className="text-2xl font-black text-white">{employees.filter(e => e.fatigueLikelihood === 'High').length}</p>
          <p className="text-[10px] text-slate-400">Fatigue Risk</p>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {employees.map(emp => {
          const eff = emp.efficiencyRating ?? emp.productivityScore;
          const completedTasks = emp.tasksCompletedToday ?? emp.completedTasksToday;
          const errors = emp.errorsToday ?? 0;
          const zone = emp.currentZone ?? emp.zone;
          const shift = emp.shiftHours ?? '08:00 — 16:00';

          return (
            <div key={emp.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm font-bold text-white">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{emp.name}</h4>
                    <p className="text-[11px] text-slate-400">{emp.role}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  emp.status === 'On Break' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>{emp.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
                  <p className="text-[10px] text-slate-400">Efficiency</p>
                  <p className={`text-sm font-bold ${eff >= 90 ? 'text-emerald-400' : eff >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                    {eff}%
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
                  <p className="text-[10px] text-slate-400">Tasks Today</p>
                  <p className="text-sm font-bold text-white">{completedTasks}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
                  <p className="text-[10px] text-slate-400">Errors</p>
                  <p className={`text-sm font-bold ${errors > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{errors}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] mb-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3 w-3" /> {zone}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="h-3 w-3" /> Shift: {shift}
                </div>
              </div>

              {/* Efficiency Bar */}
              <div className="mb-3">
                <div className="h-1.5 rounded-full bg-slate-800">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      eff >= 90 ? 'bg-emerald-500' :
                      eff >= 75 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${eff}%` }}
                  />
                </div>
              </div>

              {/* Fatigue AI Alert */}
              {emp.fatigueLikelihood === 'High' && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-[11px] font-bold text-red-300">HIGH FATIGUE RISK</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    AI detected sustained high-intensity workload. Recommend 15-min break rotation or task redistribution.
                  </p>
                </div>
              )}

              {emp.fatigueLikelihood === 'Medium' && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-2.5">
                  <p className="text-[10px] text-amber-300 font-semibold">
                    ⚡ Moderate fatigue detected — monitor for next 30 min.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
