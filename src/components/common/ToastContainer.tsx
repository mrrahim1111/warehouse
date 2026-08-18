import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWarehouse();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2.5">
      {toasts.map(toast => {
        const iconMap = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
          info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
          error: <XCircle className="h-5 w-5 text-red-400 shrink-0" />
        };

        const borderMap = {
          success: 'border-emerald-500/30 bg-slate-900/95 text-white shadow-emerald-950/40',
          info: 'border-cyan-500/30 bg-slate-900/95 text-white shadow-cyan-950/40',
          warning: 'border-amber-500/30 bg-slate-900/95 text-white shadow-amber-950/40',
          error: 'border-red-500/30 bg-slate-900/95 text-white shadow-red-950/40'
        };

        return (
          <div
            key={toast.id}
            className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 ${borderMap[toast.type]}`}
          >
            <div className="flex items-start gap-3">
              {iconMap[toast.type]}
              <div>
                <h5 className="text-xs font-bold text-white">{toast.title}</h5>
                <p className="mt-0.5 text-xs text-slate-300">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
