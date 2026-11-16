import React from 'react';
import { X, Download, FileSpreadsheet, CheckCircle2, Printer } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const BillingSheetModal = () => {
  const { isBillingModalOpen, setIsBillingModalOpen, ledger, addToast } = useMess();

  if (!isBillingModalOpen) return null;

  const totalReconciled = ledger.reduce((sum, s) => sum + (s.net || 0), 0);
  const totalRebates = ledger.reduce((sum, s) => sum + (s.rebate || 0), 0);

  const handleDownloadCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Room', 'Base Fee', 'Naga Skips', 'Rebate Deducted', 'Net Payable', 'Status'];
    const rows = ledger.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.room,
      s.base,
      s.nagaCount,
      s.rebate,
      s.net,
      s.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MessMate_October_2024_Billing_Ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Ledger Exported', 'Downloaded MessMate_October_2024_Billing_Ledger.csv.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-[420px] w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Monthly Billing Ledger
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Hostel 4 • October 2024 ({ledger.length} Students)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBillingModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pulse stats summary */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 font-mono">TOTAL RECONCILED</span>
            <p className="font-extrabold text-sm text-slate-900 font-mono mt-0.5">
              ₹{totalReconciled.toLocaleString()}
            </p>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-mono">NAGA DEDUCTIONS</span>
            <p className="font-extrabold text-sm text-[#16A34A] font-mono mt-0.5">
              ₹{totalRebates.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Ledger Preview Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden my-3">
          <div className="max-h-56 overflow-y-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-2">Student</th>
                  <th className="p-2">Naga</th>
                  <th className="p-2 text-right">Net Due</th>
                  <th className="p-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-[11px] text-slate-400">
                      No student records in live database.
                    </td>
                  </tr>
                ) : (
                  ledger.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                      <td className="p-2">
                        <p className="font-bold text-slate-900 font-sans text-xs">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.rollNo}</p>
                      </td>
                      <td className="p-2 text-slate-600">
                        {s.nagaCount} (-₹{s.rebate})
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900">
                        ₹{s.net}
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            s.status === 'PAID'
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : 'bg-[#FEE2E2] text-[#DC2626]'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownloadCSV}
            className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Spreadsheet</span>
          </button>

          <button
            onClick={() => window.print()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Official Invoice Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
