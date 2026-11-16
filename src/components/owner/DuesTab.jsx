import React from 'react';
import {
  Calendar,
  Search,
  Send,
  Bell,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const DuesTab = () => {
  const {
    ledger,
    filteredLedger,
    ledgerFilter,
    setLedgerFilter,
    ledgerSearch,
    setLedgerSearch,
    handleSendPaymentReminders,
    handleSendSingleReminder,
    setIsBillingModalOpen,
  } = useMess();

  // Dynamic calculations from live database records
  const totalStudents = ledger.length;
  const overdueStudents = ledger.filter((s) => s.status === 'OVERDUE' || s.status === 'DUE');
  const clearStudents = ledger.filter((s) => s.status === 'PAID');

  const totalDuesAmount = overdueStudents.reduce((sum, s) => sum + (s.dueAmount || s.net || 0), 0);
  const totalRebateAmount = ledger.reduce((sum, s) => sum + (s.rebate || 0), 0);
  const totalNagaMeals = ledger.reduce((sum, s) => sum + (s.nagaCount || 0), 0);

  const collectionPct = totalStudents > 0
    ? ((clearStudents.length / totalStudents) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4 px-4 py-3">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="font-mono uppercase text-[11px] tracking-wider text-slate-700">
            HOSTEL 4 • VEG MESS
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Billing & Student Ledger
          </h2>
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 cursor-pointer hover:bg-blue-100 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Oct 2024</span>
          </div>
        </div>
      </div>

      {/* Monthly Collection Pulse Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
            MONTHLY COLLECTION PULSE
          </span>
          <span className="bg-[#DCFCE7] text-[#15803D] font-bold text-xs px-2 py-0.5 rounded">
            {collectionPct}% Collected
          </span>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-2">
          {/* Subscribed */}
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5 text-center">
            <p className="text-[11px] text-slate-500 font-medium">Subscribed</p>
            <p className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {totalStudents}
            </p>
            <p className="text-[10px] text-slate-500">Students</p>
          </div>

          {/* Total Dues */}
          <div className="bg-[#FEF2F2] border border-red-100 rounded-xl p-2.5 text-center">
            <p className="text-[11px] text-[#DC2626] font-medium">Total Dues</p>
            <p className="text-base font-extrabold text-[#DC2626] font-mono mt-0.5">
              ₹{totalDuesAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#DC2626]">{overdueStudents.length} Overdue</p>
          </div>

          {/* Naga Rebates */}
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5 text-center">
            <p className="text-[11px] text-slate-500 font-medium">Naga Rebates</p>
            <p className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              ₹{totalRebateAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">{totalNagaMeals} Meals</p>
          </div>
        </div>

        {/* CTA: Send Payment Reminders */}
        <button
          onClick={handleSendPaymentReminders}
          className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Payment Reminders ({overdueStudents.length} Students)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={ledgerSearch}
          onChange={(e) => setLedgerSearch(e.target.value)}
          placeholder="Search student, roll no, room..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium shadow-xs"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 font-mono text-xs">
        {[
          { label: `All (${totalStudents})`, key: 'All' },
          { label: `Overdue (${overdueStudents.length})`, key: 'Overdue' },
          { label: `Clear (${clearStudents.length})`, key: 'Clear' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setLedgerFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              ledgerFilter === f.key
                ? 'bg-black text-white font-semibold shadow-xs'
                : 'bg-[#EFF6FF] text-[#1E40AF] font-medium hover:bg-blue-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Student Ledger Cards List */}
      <div className="space-y-2.5">
        {filteredLedger.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
              <FolderOpen className="w-6 h-6" />
            </div>
            <p className="font-bold text-xs text-slate-900">No student records found</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live student ledger records from Supabase monthly_billing will display here.
            </p>
          </div>
        ) : (
          filteredLedger.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2"
            >
              {/* Top row: Name, Room, Roll, Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs">
                      {item.name}
                    </span>
                    <span className="bg-[#EFF6FF] text-[#1E40AF] px-1.5 py-0.5 rounded text-[10px] font-mono font-medium">
                      {item.room}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {item.rollNo}
                  </p>
                </div>

                {/* Status Badge */}
                {item.status === 'PAID' && (
                  <span className="bg-[#DCFCE7] text-[#15803D] font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    <span>PAID</span>
                  </span>
                )}
                {item.status === 'DUE' && (
                  <span className="bg-[#FEE2E2] text-[#DC2626] font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                    <span>DUE ₹{item.dueAmount}</span>
                  </span>
                )}
                {item.status === 'OVERDUE' && (
                  <span className="bg-[#FEE2E2] text-[#DC2626] font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                    <span>OVERDUE</span>
                  </span>
                )}
              </div>

              {/* Financial Strip */}
              <div className="bg-[#EFF6FF]/60 border border-blue-50 rounded-xl p-2 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 text-[11px]">
                  Base: ₹{item.base.toLocaleString()} • {item.nagaCount} Naga (-₹{item.rebate})
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  Net: ₹{item.net.toLocaleString()}
                </span>
              </div>

              {/* Overdue alert / Remind button if applicable */}
              {item.dueInfo && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {item.status === 'OVERDUE' ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                        <span className="text-[#DC2626] font-semibold">{item.dueInfo}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-600 font-medium">{item.dueInfo}</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendSingleReminder(item.name, item.dueAmount || item.net)}
                    className="bg-[#EFF6FF] hover:bg-blue-100 text-[#1E40AF] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Remind</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Download Sheet Button */}
      <div className="pt-1">
        <button
          onClick={() => setIsBillingModalOpen(true)}
          className="w-full bg-[#DBEAFE] hover:bg-blue-200 text-[#1E40AF] font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#1E40AF]" />
          <span>Download Monthly Billing Sheet (Excel/PDF)</span>
        </button>

        {/* Reconciled Subtext */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-600 mt-2.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>Ledger reconciled with biometric mess hall turnstiles</span>
        </div>
      </div>
    </div>
  );
};
