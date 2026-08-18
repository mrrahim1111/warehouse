import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { RotateCcw, Database, Bell, Shield, Zap, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export const SettingsView: React.FC = () => {
  const { resetDemoData, presentationMode, togglePresentationMode, currentLanguage, setLanguage, t } = useWarehouse();

  return (
    <div className="max-w-3xl space-y-6">
      {/* Language & Regional Settings */}
      <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg bg-indigo-500/10 p-2"><Globe className="h-5 w-5 text-indigo-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">{t('language')}</h3>
            <p className="text-xs text-slate-400">{t('selectLanguage')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                currentLanguage === lang.code
                  ? 'border-cyan-500/50 bg-cyan-950/30 text-white shadow-md shadow-cyan-900/20 ring-1 ring-cyan-500/30'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div>
                <p className="text-xs font-bold">{lang.nativeName}</p>
                <p className="text-[10px] text-slate-500">{lang.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Demo Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg bg-cyan-500/10 p-2"><Zap className="h-5 w-5 text-cyan-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Demo Controls</h3>
            <p className="text-xs text-slate-400">Manage demo state and presentation mode</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div>
              <p className="text-xs font-bold text-white">Presentation Mode</p>
              <p className="text-[11px] text-slate-400">Clean up UI for hackathon presentation</p>
            </div>
            <button
              onClick={togglePresentationMode}
              className={`relative h-6 w-11 rounded-full transition-all ${presentationMode ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${presentationMode ? 'left-5.5' : 'left-0.5'}`} style={{ left: presentationMode ? '22px' : '2px' }} />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div>
              <p className="text-xs font-bold text-white">Reset Demo Data</p>
              <p className="text-[11px] text-slate-400">Restore all warehouse data to initial state</p>
            </div>
            <button
              onClick={resetDemoData}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-950/40 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Warehouse Configuration */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg bg-indigo-500/10 p-2"><Database className="h-5 w-5 text-indigo-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Warehouse Configuration</h3>
            <p className="text-xs text-slate-400">System settings and thresholds</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Warehouse Name', value: 'Austin Main Hub (TX-01)' },
            { label: 'Operating Hours', value: '06:00 — 22:00 CDT' },
            { label: 'Total Capacity (Bins)', value: '2,400 bins' },
            { label: 'Current Utilization', value: '78%' },
            { label: 'AI Decision Engine', value: 'WareMind v2.1 — Active' },
            { label: 'Stockout Alert Threshold', value: '≤ 3 days estimated supply' },
            { label: 'Priority Scoring Model', value: 'Multi-factor weighted (7 factors)' },
            { label: 'SLA Auto-Escalation', value: '≤ 60 minutes before deadline' }
          ].map(setting => (
            <div key={setting.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
              <span className="text-xs text-slate-400">{setting.label}</span>
              <span className="text-xs font-bold text-white">{setting.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg bg-amber-500/10 p-2"><Bell className="h-5 w-5 text-amber-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">Notification Preferences</h3>
            <p className="text-xs text-slate-400">Configure alert delivery channels</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Critical Stockout Alerts', enabled: true },
            { label: 'SLA Breach Warnings', enabled: true },
            { label: 'Order Exception Notifications', enabled: true },
            { label: 'Employee Fatigue Warnings', enabled: false },
            { label: 'AI Decision Summaries', enabled: true },
            { label: 'Supplier Delivery Updates', enabled: false }
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
              <span className="text-xs text-slate-300">{pref.label}</span>
              <div className={`relative h-5 w-9 rounded-full transition-all ${pref.enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" style={{ left: pref.enabled ? '18px' : '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-emerald-500/10 p-2"><Shield className="h-5 w-5 text-emerald-400" /></div>
          <div>
            <h3 className="text-sm font-bold text-white">System Information</h3>
            <p className="text-xs text-slate-400">Platform and build details</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-slate-400">Platform</p>
            <p className="font-bold text-white">WareMind AI v2.1</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-slate-400">Build</p>
            <p className="font-bold text-white">2026.08.18-hackathon</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-slate-400">Frontend</p>
            <p className="font-bold text-white">React 18 + TypeScript + Vite</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-slate-400">AI Engine</p>
            <p className="font-bold text-white">Deterministic Multi-Factor (Local)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
