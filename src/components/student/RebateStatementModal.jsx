import React from 'react';
import { X, CheckCircle2, Download, PiggyBank, ArrowDownRight, FolderOpen } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const RebateStatementModal = () => {
  const {
    isRebateModalOpen,
    setIsRebateModalOpen,
    totalRebate,
    totalNagaCount,
    rebateHistory,
    dinnerAttending,
    lunchAttending,
    addToast,
  } = useMess();

  if (!isRebateModalOpen) return null;

  // Include dynamic skips if user has toggled them off
  const dynamicHistory = [...rebateHistory];
  if (!lunchAttending) {
    dynamicHistory.unshift({
      date: 'Today, Oct 18',
      meal: 'Lunch',
      amount: 80,
      reason: 'Naga Marked via App (Attending OFF)',
      status: 'Pending Sync',
    });
  }
  if (!dinnerAttending) {
    dynamicHistory.unshift({
      date: 'Today, Oct 18',
      meal: 'Dinner',
      amount: 80,
      reason: 'Naga Marked via App (Attending OFF)',
      status: 'Approved',
    });
  }

  const handleDownloadSlip = () => {
    addToast('Statement Downloaded', 'PDF Rebate Voucher saved to downloads.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-[400px] w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Naga Rebate Statement
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                October 2024 • Rohan Verma (304)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRebateModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Summary */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3.5 my-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium">Total Rebate Accumulated</p>
            <p className="text-xl font-extrabold text-[#16A34A] tabular-nums mt-0.5">
              ₹{totalRebate}
            </p>
          </div>
          <div className="text-right">
            <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {totalNagaCount} Skips Claimed
            </span>
            <p className="text-[10px] text-slate-500 font-mono mt-1">@ ₹80 / meal</p>
          </div>
        </div>

        {/* History Item List */}
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold px-0.5">
            Breakdown by Date
          </p>
          {dynamicHistory.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-slate-700">No Naga skips recorded yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Turn OFF Lunch or Dinner to mark Naga and claim ₹80 rebate.
              </p>
            </div>
          ) : (
            dynamicHistory.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>{item.date}</span>
                    <span className="text-[10px] font-mono bg-blue-100/70 text-blue-700 px-1.5 py-0.5 rounded">
                      {item.meal}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.reason}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#16A34A] tabular-nums">
                    +₹{item.amount}
                  </span>
                  <p className="text-[10px] text-slate-600 flex items-center gap-0.5 justify-end mt-0.5 font-medium">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#16A34A]" />
                    <span>{item.status}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reconciliation note */}
        <p className="text-[11px] text-slate-500 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/80 mb-4 leading-relaxed">
          ℹ Credits will be automatically deducted from your upcoming November mess billing slip.
        </p>

        {/* Download Button */}
        <button
          onClick={handleDownloadSlip}
          className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF Statement</span>
        </button>
      </div>
    </div>
  );
};
