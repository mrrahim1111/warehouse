import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { AlertTriangle } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, inventory } = useWarehouse();

  return (
    <div className="space-y-6">
      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map(supplier => {
          const suppliedItems = inventory.filter(i => i.supplierName === supplier.name);
          const criticalItems = suppliedItems.filter(i => i.status === 'Critical' || i.status === 'Out of Stock');
          const relScore = supplier.reliabilityScore ?? supplier.reliabilityRate;
          const leadTime = supplier.avgLeadTimeDays ?? supplier.leadTimeDays;
          const history = supplier.deliveryHistory ?? [true, true, true, true, true];

          return (
            <div key={supplier.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{supplier.name}</h4>
                  <p className="text-[11px] text-slate-400">{supplier.location || 'Primary Hub'}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                  relScore >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  relScore >= 70 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {relScore}% Reliable
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-center">
                  <p className="text-[10px] text-slate-400">Lead Time</p>
                  <p className="text-sm font-bold text-white">{leadTime}d</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-center">
                  <p className="text-[10px] text-slate-400">Active SKUs</p>
                  <p className="text-sm font-bold text-cyan-400">{supplier.activeSkuCount ?? supplier.productsSupplied.length}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-center">
                  <p className="text-[10px] text-slate-400">Fill Rate</p>
                  <p className="text-sm font-bold text-emerald-400">{supplier.fillRate ?? 98}%</p>
                </div>
              </div>

              {/* Reliability Score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">Reliability Score</span>
                  <span className="text-[10px] font-bold text-white">{relScore}/100</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      relScore >= 90 ? 'bg-emerald-500' :
                      relScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${relScore}%` }}
                  />
                </div>
              </div>

              {/* Last Delivery */}
              <div className="flex items-center justify-between text-[11px] mb-3">
                <span className="text-slate-400">Last Delivery:</span>
                <span className="text-white font-semibold">{supplier.lastDelivery || supplier.lastOrderDate}</span>
              </div>

              {/* On-time history */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-[10px] text-slate-400 mr-1">Last 10 deliveries:</span>
                {history.map((onTime: boolean, idx: number) => (
                  <div
                    key={idx}
                    className={`h-4 w-4 rounded-sm text-center text-[8px] font-bold leading-4 ${
                      onTime ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {onTime ? '✓' : '✗'}
                  </div>
                ))}
              </div>

              {criticalItems.length > 0 && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-[11px] font-bold text-red-300">{criticalItems.length} Critical SKU(s)</span>
                  </div>
                  {criticalItems.map(item => (
                    <p key={item.sku} className="text-[10px] text-slate-400">{item.sku}: {item.productName} ({item.availableStock} left)</p>
                  ))}
                </div>
              )}

              {/* Contract Info */}
              <div className="mt-3 text-[11px] text-slate-500">
                Contract: {supplier.contractType || 'Standard SLA'} • Payment: {supplier.paymentTerms || 'Net 30'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
