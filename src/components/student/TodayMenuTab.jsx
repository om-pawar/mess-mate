import React from 'react';
import { Calendar, Sun, Moon, PiggyBank, Star, Sparkles, Cookie } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const TodayMenuTab = () => {
  const {
    student,
    totalRebate,
    lunchAttending,
    dinnerAttending,
    handleToggleLunch,
    handleToggleDinner,
    yesterdayRating,
    handleRateYesterday,
  } = useMess();

  return (
    <div className="space-y-4 px-4 py-3">
      {/* Header & Greeting */}
      <div>
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Hostel 4 • Veg Mess
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Hello Rohan <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
          </h2>
          <div className="bg-[#EFF6FF] border border-blue-100/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Fri, Oct 18</span>
          </div>
        </div>
      </div>

      {/* Month Savings via Naga Banner */}
      <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-[#16A34A]">
            <PiggyBank className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-slate-700">
            Month Savings via Naga:
          </span>
        </div>
        <span className="text-xs font-bold text-[#16A34A] tabular-nums">
          ₹{totalRebate} credited
        </span>
      </div>

      {/* Lunch Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        {/* Header with Sun, Time & Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" strokeWidth={2.2} />
            <span className="font-bold text-slate-900 text-sm">Lunch</span>
            <span className="text-xs text-slate-500 font-mono">12:30 – 2:30 PM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold px-2 py-0.5 rounded">
              Pure Veg
            </span>
            <span className="bg-[#FEF3C7] text-[#D97706] text-[11px] font-semibold px-2 py-0.5 rounded">
              Special
            </span>
          </div>
        </div>

        {/* Interactive Toggle Box */}
        <div className="bg-[#EFF6FF]/60 border border-blue-100 rounded-xl p-3 my-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-800">
                Eating Lunch today?
              </span>
              {lunchAttending ? (
                <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                  ATTENDING
                </span>
              ) : (
                <span className="bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                  SKIPPED (NAGA)
                </span>
              )}
            </div>

            {/* iOS Switch */}
            <button
              type="button"
              onClick={handleToggleLunch}
              aria-label="Toggle lunch attendance"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                lunchAttending ? 'bg-black' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  lunchAttending ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cutoff: 10:00 AM • Turn OFF to mark Naga & save ₹80
          </p>
        </div>

        {/* Menu Items List */}
        <div className="space-y-2.5 pt-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
              <span className="font-semibold text-slate-800">Paneer Butter Masala</span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Chef Special</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Yellow Dal Tadka</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Steamed Basmati Rice</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">4 Butter Phulkas</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Green Salad & Mint Raita</span>
          </div>

          {/* Highlighted Gulab Jamun Item */}
          <div className="bg-[#EFF6FF]/60 border border-blue-100/80 rounded-xl p-2.5 flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-slate-800">Gulab Jamun (2 pcs)</span>
            </div>
            <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded">
              Sweet
            </span>
          </div>
        </div>
      </div>

      {/* Dinner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        {/* Header with Moon & Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-600" strokeWidth={2.2} />
            <span className="font-bold text-slate-900 text-sm">Dinner</span>
            <span className="text-xs text-slate-500 font-mono">8:00 – 10:00 PM</span>
          </div>
          <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold px-2 py-0.5 rounded">
            Pure Veg
          </span>
        </div>

        {/* Interactive Toggle Box */}
        <div className="bg-[#EFF6FF]/60 border border-blue-100 rounded-xl p-3 my-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-800">
                Eating Dinner tonight?
              </span>
              {dinnerAttending ? (
                <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                  ATTENDING
                </span>
              ) : (
                <span className="bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                  SKIPPED (NAGA)
                </span>
              )}
            </div>

            {/* iOS Switch */}
            <button
              type="button"
              onClick={handleToggleDinner}
              aria-label="Toggle dinner attendance"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                dinnerAttending ? 'bg-black' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  dinnerAttending ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cutoff: 5:00 PM • Turn OFF to mark Naga & save ₹80
          </p>
        </div>

        {/* Menu Items List */}
        <div className="space-y-2.5 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="font-semibold text-slate-800">Mix Veg Handi</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Moong Dal Fry</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Tawa Roti (Unlimited)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Jeera Rice</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-slate-700">Fresh Curd & Pickle</span>
          </div>
        </div>
      </div>

      {/* Rating Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-bold text-slate-900 text-sm">
            Rate Yesterday's Dinner
          </h3>
          <span className="text-xs font-semibold text-[#16A34A]">
            Tap to rate
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Helps mess committee adjust quality
        </p>

        {/* 5 Stars Container */}
        <div className="bg-[#EFF6FF]/50 border border-blue-100/70 rounded-xl p-3 flex justify-around items-center">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <button
              key={starIndex}
              type="button"
              onClick={() => handleRateYesterday(starIndex)}
              className="p-1 hover:scale-125 transition-transform cursor-pointer"
              aria-label={`Rate ${starIndex} stars`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  starIndex <= yesterdayRating
                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
                strokeWidth={1.6}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
