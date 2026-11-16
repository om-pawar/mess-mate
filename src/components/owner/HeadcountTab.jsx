import React from 'react';
import {
  Calendar,
  CheckSquare,
  QrCode,
  Utensils,
  CookingPot,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const HeadcountTab = () => {
  const {
    totalSubscribed,
    lunchHeadcount,
    dinnerHeadcount,
    setIsScannerOpen,
  } = useMess();

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
            Today's Meal Prep
          </h2>
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Fri, Oct 18</span>
          </div>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-[#EFF6FF]/70 border border-blue-100 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded text-[#16A34A] flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-[#16A34A]" strokeWidth={2.2} />
          </div>
          <span className="text-xs font-medium text-slate-800">
            Headcount in sync with student portal
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs font-extrabold text-slate-900 font-mono">{totalSubscribed}</p>
          <p className="text-[10px] text-slate-500 font-mono">Subscribed</p>
        </div>
      </div>

      {/* Primary Scanner Action Button */}
      <div>
        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
        >
          <QrCode className="w-4 h-4 text-white" strokeWidth={2.2} />
          <span>Open Counter QR Scanner</span>
        </button>
        <p className="text-[11px] text-slate-500 text-center mt-1.5">
          Use for student meal check-in at the dining entrance
        </p>
      </div>

      {/* Lunch Prep Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-slate-700" strokeWidth={2.2} />
            <span className="font-bold text-slate-900 text-sm">Lunch</span>
            <span className="text-xs text-slate-500 font-mono">12:30 – 2:30 PM</span>
          </div>
          <span className="bg-[#EFF6FF] text-[#1E40AF] text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md">
            {lunchHeadcount.statusPill || 'Live Prep'}
          </span>
        </div>

        {/* Plates & Target */}
        <div className="flex items-baseline justify-between mb-1.5">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                {lunchHeadcount.expected}
              </span>
              <span className="text-xs text-slate-500">plates expected</span>
            </div>
            <p className="text-xs font-semibold text-[#DC2626] mt-0.5">
              {lunchHeadcount.nagaCount} students marked Naga (Skipping)
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-[#16A34A] font-mono">
              {lunchHeadcount.targetPot}
            </span>
            <p className="text-[10px] font-mono tracking-wider text-slate-700 uppercase mt-0.5">
              TARGET POT
            </p>
          </div>
        </div>

        {/* Locked Cook Instruction Callout */}
        <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-2.5 mt-3 flex items-center gap-2 text-xs text-[#065F46]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
          <span className="font-medium text-[11px]">
            Cook instruction locked: Prepare for {lunchHeadcount.targetPot} portions (+{lunchHeadcount.buffer} buffer)
          </span>
        </div>
      </div>

      {/* Dinner Prep Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CookingPot className="w-4 h-4 text-slate-700" strokeWidth={2.2} />
            <span className="font-bold text-slate-900 text-sm">Dinner</span>
            <span className="text-xs text-slate-500 font-mono">8:00 – 10:00 PM</span>
          </div>
          <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Live till 5:00 PM</span>
          </span>
        </div>

        {/* Plates & Target */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                {dinnerHeadcount.baseExpected}
              </span>
              <span className="text-xs text-slate-500">plates currently</span>
            </div>
            <p className="text-xs font-semibold text-[#DC2626] mt-0.5">
              {dinnerHeadcount.baseNagaCount} marked Naga so far
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              ~{dinnerHeadcount.baseExpected}
            </span>
            <p className="text-[10px] font-mono tracking-wider text-slate-700 uppercase mt-0.5">
              EST. OUTPUT
            </p>
          </div>
        </div>

        {/* Card Footer: Cutoff timer & Responded % */}
        <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>{dinnerHeadcount.cutoffText}</span>
          <span>{dinnerHeadcount.respondedPct}</span>
        </div>
      </div>
    </div>
  );
};
