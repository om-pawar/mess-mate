import React from 'react';
import {
  RotateCw,
  FileText,
  BookOpen,
  Info,
  CheckCircle2,
  Clock,
  Check,
  Leaf,
  CircleDashed,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const MessPassTab = () => {
  const {
    student,
    lunchAttending,
    dinnerAttending,
    totalNagaCount,
    totalRebate,
    mealsLeft,
    formattedCountdown,
    currentTimeIST,
    setIsRebateModalOpen,
    setIsRulesModalOpen,
  } = useMess();

  const isLunchCheckedIn = student.lunchAttendedTime && student.lunchAttendedTime !== '--:--';

  return (
    <div className="space-y-4 px-4 py-3">
      {/* Top Status Strip */}
      <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]" />
          </span>
          <span className="text-xs font-mono font-medium text-slate-900 uppercase tracking-tight">
            DINNER WINDOW OPENS 07:30 PM
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-700 tracking-wider">
          LIVE PASS
        </span>
      </div>

      {/* Student ID Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-xs"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                {student.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {student.rollNo}
              </p>
            </div>
          </div>
          <span className="bg-[#DCFCE7] text-[#16A34A] font-bold text-xs px-2.5 py-0.5 rounded tracking-wide">
            ACTIVE
          </span>
        </div>

        {/* Bottom Bar: Subscription & Room */}
        <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2 mt-2.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{student.subscription}</span>
          </div>
          <span className="text-slate-500 font-mono">
            {student.hostel}
          </span>
        </div>
      </div>

      {/* Live QR Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
        {/* Countdown & Pass ID */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-mono">
            <RotateCw className="w-3.5 h-3.5 text-slate-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Refreshes in {formattedCountdown}</span>
          </div>
          <span className="font-mono font-bold text-slate-900">
            {student.qrCodeId}
          </span>
        </div>

        {/* Sharp High-Contrast QR Code */}
        <div className="flex justify-center my-1">
          <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs inline-block">
            <svg
              className="w-48 h-48 mx-auto"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Top-Left Finder */}
              <rect x="10" y="10" width="40" height="40" rx="6" fill="#0F172A" />
              <rect x="18" y="18" width="24" height="24" rx="2" fill="#FFFFFF" />
              <rect x="24" y="24" width="12" height="12" rx="2" fill="#0F172A" />

              {/* Outer Top-Right Finder */}
              <rect x="110" y="10" width="40" height="40" rx="6" fill="#0F172A" />
              <rect x="118" y="18" width="24" height="24" rx="2" fill="#FFFFFF" />
              <rect x="124" y="24" width="12" height="12" rx="2" fill="#0F172A" />

              {/* Outer Bottom-Left Finder */}
              <rect x="10" y="110" width="40" height="40" rx="6" fill="#0F172A" />
              <rect x="18" y="118" width="24" height="24" rx="2" fill="#FFFFFF" />
              <rect x="24" y="124" width="12" height="12" rx="2" fill="#0F172A" />

              {/* Data Matrix Dots & Rectangles */}
              <rect x="72" y="72" width="16" height="16" rx="2" fill="#0F172A" />
              <rect x="56" y="20" width="8" height="8" fill="#0F172A" />
              <rect x="70" y="20" width="8" height="8" fill="#0F172A" />
              <rect x="84" y="20" width="8" height="8" fill="#0F172A" />
              <rect x="96" y="20" width="6" height="8" fill="#0F172A" />

              <rect x="20" y="56" width="8" height="8" fill="#0F172A" />
              <rect x="20" y="70" width="8" height="8" fill="#0F172A" />
              <rect x="20" y="84" width="8" height="8" fill="#0F172A" />
              <rect x="20" y="96" width="8" height="6" fill="#0F172A" />

              <rect x="58" y="36" width="10" height="10" fill="#0F172A" />
              <rect x="76" y="36" width="10" height="10" fill="#0F172A" />
              <rect x="94" y="36" width="8" height="10" fill="#0F172A" />

              <rect x="58" y="54" width="8" height="10" fill="#0F172A" />
              <rect x="94" y="54" width="10" height="8" fill="#0F172A" />

              <rect x="36" y="58" width="10" height="10" fill="#0F172A" />
              <rect x="36" y="76" width="10" height="10" fill="#0F172A" />
              <rect x="36" y="94" width="10" height="8" fill="#0F172A" />

              <rect x="58" y="74" width="8" height="12" fill="#0F172A" />
              <rect x="94" y="74" width="10" height="12" fill="#0F172A" />

              <rect x="56" y="94" width="10" height="8" fill="#0F172A" />
              <rect x="74" y="94" width="12" height="8" fill="#0F172A" />
              <rect x="94" y="94" width="10" height="8" fill="#0F172A" />

              <rect x="58" y="112" width="12" height="12" fill="#0F172A" />
              <rect x="78" y="112" width="8" height="12" fill="#0F172A" />
              <rect x="94" y="112" width="12" height="12" fill="#0F172A" />
              <rect x="114" y="112" width="12" height="12" fill="#0F172A" />
              <rect x="134" y="112" width="12" height="12" fill="#0F172A" />

              <rect x="58" y="132" width="12" height="12" fill="#0F172A" />
              <rect x="78" y="132" width="14" height="12" fill="#0F172A" />
              <rect x="100" y="132" width="10" height="12" fill="#0F172A" />
              <rect x="118" y="132" width="12" height="12" fill="#0F172A" />
              <rect x="138" y="132" width="8" height="12" fill="#0F172A" />
            </svg>
          </div>
        </div>

        {/* Scan instruction */}
        <h4 className="font-bold text-slate-900 text-xs mt-3">
          Scan at mess counter for entry
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Brightness adjusts automatically for fast turnstile scan
        </p>

        {/* Terminal & Time Bar */}
        <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-2.5 mt-3 flex items-center justify-between text-[11px] font-mono text-slate-700">
          <span className="font-medium tracking-tight">{student.terminal}</span>
          <span className="font-semibold text-slate-900">{currentTimeIST}</span>
        </div>
      </div>

      {/* Today's Meal Status */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase">
            TODAY'S MEAL STATUS
          </span>
          <span className="text-[10px] font-mono text-slate-500">24 OCT</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Lunch Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Lunch</span>
              {isLunchCheckedIn ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              ) : (
                <CircleDashed className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
            <p className="font-bold text-xs text-slate-900">
              {isLunchCheckedIn ? 'Attended' : lunchAttending ? 'Scheduled' : 'Skipped (Naga)'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {isLunchCheckedIn ? student.lunchAttendedTime : lunchAttending ? '12:30 - 02:30 PM' : 'Rebate active'}
            </p>
          </div>

          {/* Dinner Card */}
          <div className="bg-[#EFF6FF]/60 border border-blue-100 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Dinner</span>
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="font-bold text-xs text-slate-900">
              {dinnerAttending ? 'Scheduled' : 'Skipped (Naga)'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {dinnerAttending ? student.dinnerWindow : 'Rebate credited'}
            </p>
          </div>
        </div>
      </div>

      {/* October Account Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase">
            OCTOBER ACCOUNT SUMMARY
          </span>
          <span className="text-[10px] font-mono font-bold text-[#16A34A]">
            LIVE SYNC
          </span>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-3 gap-2 text-center pb-2">
          <div>
            <p className="text-[11px] text-slate-500">Meals Left</p>
            <p className="font-extrabold text-sm text-slate-900 tabular-nums mt-0.5">
              {mealsLeft} <span className="font-normal text-xs text-slate-400">/ 60</span>
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500">Skips (Naga)</p>
            <p className="font-extrabold text-sm text-slate-900 tabular-nums mt-0.5">
              {totalNagaCount}
            </p>
            <p className="text-[10px] text-slate-400">meals saved</p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500">Rebate Earned</p>
            <p className="font-extrabold text-sm text-[#16A34A] tabular-nums mt-0.5">
              ₹{totalRebate}
            </p>
            <p className="text-[10px] text-slate-400">auto-rebate</p>
          </div>
        </div>

        {/* Info callout */}
        <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-2.5 mt-2 flex items-center gap-2 text-[11px] text-slate-700">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            ₹{totalRebate} will be adjusted in next month mess billing invoice.
          </span>
        </div>
      </div>

      {/* Bottom Dual Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={() => setIsRebateModalOpen(true)}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-700" />
          <span>Rebate Statement</span>
        </button>

        <button
          onClick={() => setIsRulesModalOpen(true)}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-700" />
          <span>Mess Rules</span>
        </button>
      </div>
    </div>
  );
};
