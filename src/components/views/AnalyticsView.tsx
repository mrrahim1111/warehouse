import React from 'react';
import {
  BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle,
  Package, Truck, ShieldCheck, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export const AnalyticsView: React.FC = () => {

  const ordersByDay = [
    { day: 'Mon', orders: 42, fulfilled: 38 },
    { day: 'Tue', orders: 55, fulfilled: 50 },
    { day: 'Wed', orders: 48, fulfilled: 44 },
    { day: 'Thu', orders: 61, fulfilled: 56 },
    { day: 'Fri', orders: 38, fulfilled: 35 },
    { day: 'Sat', orders: 22, fulfilled: 21 },
    { day: 'Sun', orders: 15, fulfilled: 14 }
  ];

  const processingTime = [
    { hour: '08:00', pickMin: 4.2, packMin: 6.1, qcMin: 2.8 },
    { hour: '09:00', pickMin: 3.8, packMin: 5.4, qcMin: 2.5 },
    { hour: '10:00', pickMin: 5.1, packMin: 7.2, qcMin: 3.2 },
    { hour: '11:00', pickMin: 5.8, packMin: 7.8, qcMin: 3.6 },
    { hour: '12:00', pickMin: 4.5, packMin: 6.0, qcMin: 2.9 },
    { hour: '13:00', pickMin: 3.9, packMin: 5.2, qcMin: 2.4 },
    { hour: '14:00', pickMin: 4.8, packMin: 6.5, qcMin: 3.0 }
  ];

  const exceptionTrend = [
    { day: 'Mon', count: 3 }, { day: 'Tue', count: 5 }, { day: 'Wed', count: 2 },
    { day: 'Thu', count: 7 }, { day: 'Fri', count: 4 }, { day: 'Sat', count: 1 }, { day: 'Sun', count: 0 }
  ];

  const stockoutTrend = [
    { day: 'Mon', skus: 1 }, { day: 'Tue', skus: 0 }, { day: 'Wed', skus: 2 },
    { day: 'Thu', skus: 3 }, { day: 'Fri', skus: 1 }, { day: 'Sat', skus: 0 }, { day: 'Sun', skus: 0 }
  ];

  const zoneEfficiency = [
    { zone: 'Zone A', eff: 91 }, { zone: 'Zone B', eff: 74 }, { zone: 'Zone C', eff: 95 },
    { zone: 'Zone D', eff: 93 }, { zone: 'Packing', eff: 82 }, { zone: 'QC', eff: 89 },
    { zone: 'Dispatch', eff: 88 }, { zone: 'Receiving', eff: 94 }
  ];

  const kpis = [
    { label: 'Fulfillment Rate', value: '92.4%', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'On-Time Dispatch', value: '88.6%', icon: Truck, color: 'text-cyan-400' },
    { label: 'Avg Pick Time', value: '4.5 min', icon: Clock, color: 'text-amber-400' },
    { label: 'Avg Pack Time', value: '6.3 min', icon: Package, color: 'text-purple-400' },
    { label: 'Exception Rate', value: '3.2%', icon: AlertTriangle, color: 'text-rose-400' },
    { label: 'Inventory Accuracy', value: '97.8%', icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'Warehouse Utilization', value: '78%', icon: Activity, color: 'text-cyan-400' }
  ];

  const COLORS = ['#0EA5E9', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
              <Icon className={`h-5 w-5 mx-auto mb-1.5 ${kpi.color}`} />
              <p className="text-lg font-black text-white">{kpi.value}</p>
              <p className="text-[10px] text-slate-400">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders by Day */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-cyan-400" /> Orders & Fulfillment by Day</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="orders" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fulfilled" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Processing Time */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-400" /> Average Processing Time (min)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={processingTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="pickMin" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} name="Pick" />
              <Line type="monotone" dataKey="packMin" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} name="Pack" />
              <Line type="monotone" dataKey="qcMin" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="QC" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Exception Trend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4">Exception Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={exceptionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="count" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stockout Trend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4">Stockout SKUs per Day</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stockoutTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="skus" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Efficiency */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-sm font-bold text-white mb-4">Zone Efficiency %</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={zoneEfficiency} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 100]} />
              <YAxis type="category" dataKey="zone" tick={{ fontSize: 10, fill: '#94A3B8' }} width={70} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="eff" radius={[0, 4, 4, 0]}>
                {zoneEfficiency.map((_entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
