import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  changeText?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  changeText,
  changeType = 'increase',
  icon: Icon,
  color,
  onClick
}) => {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-transparent text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40',
    indigo: 'from-indigo-500/10 to-transparent text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40',
    emerald: 'from-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'from-amber-500/10 to-transparent text-amber-400 border-amber-500/20 hover:border-amber-500/40',
    rose: 'from-rose-500/10 to-transparent text-rose-400 border-rose-500/20 hover:border-rose-500/40',
    purple: 'from-purple-500/10 to-transparent text-purple-400 border-purple-500/20 hover:border-purple-500/40'
  };

  const iconBgMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    indigo: 'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    rose: 'bg-rose-500/10 text-rose-400',
    purple: 'bg-purple-500/10 text-purple-400'
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-b bg-gray-900/90 p-4 transition-all duration-200 ${colorMap[color]} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</h3>
        </div>
        <div className={`rounded-lg p-2.5 ${iconBgMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {changeText && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {changeType === 'increase' && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
          {changeType === 'decrease' && <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
          {changeType === 'neutral' && <Minus className="h-3.5 w-3.5 text-slate-400" />}
          <span
            className={
              changeType === 'increase'
                ? 'text-emerald-400 font-medium'
                : changeType === 'decrease'
                ? 'text-rose-400 font-medium'
                : 'text-slate-400'
            }
          >
            {changeText}
          </span>
        </div>
      )}
    </div>
  );
};
