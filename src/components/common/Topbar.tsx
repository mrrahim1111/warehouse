import React, { useState, useEffect } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import {
  Search,
  Bell,
  Play,
  Monitor,
  Building,
  Clock,
  X,
  RotateCcw,
  Globe
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import type { LanguageCode } from '../../i18n/translations';

export const Topbar: React.FC = () => {
  const {
    activeView,
    presentationMode,
    togglePresentationMode,
    startLiveSimulation,
    setIsCommandBarOpen,
    notifications,
    markNotificationRead,
    resetDemoData,
    setActiveView,
    currentLanguage,
    setLanguage,
    t
  } = useWarehouse();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('Austin Main Hub (TX-01)');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur-md">
      {/* Left: View Title & Tagline */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold capitalize text-white">
              {activeView === 'ai-center' ? t('aiCenter') : activeView === 'ai-assistant' ? t('aiAssistant') : t(activeView) || activeView}
            </h2>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">LIVE</span>
          </div>
          <p className="hidden text-xs text-slate-400 sm:block">
            “{t('tagline')}”
          </p>
        </div>

        {/* Warehouse Selector */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 md:flex">
          <Building className="h-3.5 w-3.5 text-cyan-400" />
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer"
          >
            <option value="Austin Main Hub (TX-01)" className="bg-slate-900 text-white">Austin Main Hub (TX-01)</option>
            <option value="San Jose Logistics (CA-02)" className="bg-slate-900 text-white">San Jose Logistics (CA-02)</option>
            <option value="Chicago Regional (IL-04)" className="bg-slate-900 text-white">Chicago Regional (IL-04)</option>
          </select>
        </div>
      </div>

      {/* Middle: Global Search Button */}
      <div className="hidden max-w-xs flex-1 px-4 lg:block">
        <button
          onClick={() => setIsCommandBarOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-400 transition-all hover:border-slate-700 hover:text-slate-200"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span>{t('searchPlaceholder')}</span>
          </div>
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">⌘K</kbd>
        </button>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:border-cyan-500/30 transition-all">
          <Globe className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Clock */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 sm:flex">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-mono text-xs">{currentTime || '11:45:00 AM'}</span>
        </div>

        {/* HERO BUTTON: RUN LIVE SIMULATION */}
        <button
          onClick={startLiveSimulation}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-cyan-500/35 active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-current text-white transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">{t('runSimulation')}</span>
          <span className="sm:hidden">{t('liveSimShort')}</span>
        </button>

        {/* Presentation Mode Toggle */}
        <button
          onClick={togglePresentationMode}
          title="Toggle Hackathon Presentation Mode"
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
            presentationMode
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-md shadow-indigo-500/20'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">{presentationMode ? t('exitDemoMode') : t('presentationMode')}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition-colors hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white">Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkView) setActiveView(n.linkView as any);
                    }}
                    className={`cursor-pointer rounded-lg border p-2.5 text-xs transition-colors ${
                      n.read ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-700 bg-slate-800/80 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={resetDemoData}
          title="Reset Demo Data"
          className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 border-l border-slate-800 pl-3">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-cyan-500/40 bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
              alt="Rachel Adams"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden text-left xl:block">
            <p className="text-xs font-bold leading-none text-white">Rachel Adams</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Warehouse Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};
