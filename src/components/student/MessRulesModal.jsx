import React from 'react';
import { X, BookOpen, Clock, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const MessRulesModal = () => {
  const { isRulesModalOpen, setIsRulesModalOpen, messRules } = useMess();

  if (!isRulesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-[400px] w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Mess Dining Rules & Code
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Hostel 4 • Central Dining Committee
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRulesModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rules List */}
        <div className="divide-y divide-slate-100 my-2">
          {messRules.map((rule, index) => (
            <div key={index} className="py-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                  {index + 1}
                </span>
                {rule.title}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed pl-5.5">
                {rule.description}
              </p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsRulesModalOpen(false)}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer mt-2"
        >
          Understood & Close
        </button>
      </div>
    </div>
  );
};
