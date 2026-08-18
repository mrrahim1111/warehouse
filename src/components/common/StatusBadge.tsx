import React from 'react';
import type { PriorityLevel, StockStatus, OrderStage, ExceptionStatus } from '../../types/warehouse';

interface StatusBadgeProps {
  type: 'priority' | 'stock' | 'stage' | 'exception' | 'delay';
  value: PriorityLevel | StockStatus | OrderStage | ExceptionStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'md' }) => {
  let colorStyle = 'bg-gray-800 text-gray-300 border-gray-700';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  if (type === 'priority') {
    switch (value) {
      case 'Critical':
        colorStyle = 'bg-red-950/80 text-red-400 border-red-800/60 shadow-sm shadow-red-900/50 animate-pulse';
        break;
      case 'High':
        colorStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
        break;
      case 'Medium':
        colorStyle = 'bg-blue-950/80 text-blue-400 border-blue-800/60';
        break;
      case 'Low':
        colorStyle = 'bg-slate-800 text-slate-300 border-slate-700';
        break;
    }
  } else if (type === 'stock') {
    switch (value) {
      case 'Healthy':
        colorStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
        break;
      case 'Low Stock':
        colorStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
        break;
      case 'Critical':
      case 'Out of Stock':
        colorStyle = 'bg-red-950/80 text-red-400 border-red-800/60 animate-pulse';
        break;
      case 'Overstock':
        colorStyle = 'bg-purple-950/80 text-purple-400 border-purple-800/60';
        break;
    }
  } else if (type === 'exception') {
    switch (value) {
      case 'Active':
        colorStyle = 'bg-red-950/80 text-red-400 border-red-800/60 animate-pulse';
        break;
      case 'Investigating':
      case 'In Resolution':
        colorStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
        break;
      case 'Resolved':
        colorStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
        break;
    }
  } else if (type === 'delay') {
    switch (value) {
      case 'Critical':
        colorStyle = 'bg-red-950/80 text-red-400 border-red-800/60';
        break;
      case 'High':
        colorStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
        break;
      case 'Medium':
        colorStyle = 'bg-blue-950/80 text-blue-400 border-blue-800/60';
        break;
      case 'Low':
        colorStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
        break;
    }
  } else if (type === 'stage') {
    switch (value) {
      case 'Dispatched':
      case 'Delivered':
        colorStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
        break;
      case 'Picking':
      case 'Packing':
      case 'Quality Check':
        colorStyle = 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
        break;
      default:
        colorStyle = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${sizeClasses} ${colorStyle}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
};
