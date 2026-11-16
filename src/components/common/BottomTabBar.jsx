import React from 'react';
import {
  Utensils,
  QrCode,
  CookingPot,
  Megaphone,
  Receipt,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const BottomTabBar = () => {
  const { currentUserRole, studentTab, setStudentTab, ownerTab, setOwnerTab } = useMess();

  if (!currentUserRole) return null;

  // Student Bottom Tab Bar (2 tabs: Today Menu | Mess Pass)
  if (currentUserRole === 'student') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-8 flex justify-around items-center z-30 shadow-lg">
        {/* Today Menu */}
        <button
          onClick={() => setStudentTab('today-menu')}
          className={`flex flex-col items-center gap-1 py-1 px-4 transition-colors cursor-pointer ${
            studentTab === 'today-menu'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          {/* Fork & Knife Icon matching screenshot */}
          <div className="relative">
            <Utensils className="w-5 h-5" strokeWidth={studentTab === 'today-menu' ? 2.4 : 1.8} />
          </div>
          <span className="text-[11px] leading-tight">Today Menu</span>
        </button>

        {/* Mess Pass */}
        <button
          onClick={() => setStudentTab('mess-pass')}
          className={`flex flex-col items-center gap-1 py-1 px-4 transition-colors cursor-pointer ${
            studentTab === 'mess-pass'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          {/* QR Scan Pass Icon */}
          <div className="relative">
            <QrCode className="w-5 h-5" strokeWidth={studentTab === 'mess-pass' ? 2.4 : 1.8} />
          </div>
          <span className="text-[11px] leading-tight">Mess Pass</span>
        </button>
      </nav>
    );
  }

  // Owner Console Bottom Tab Bar (3 tabs: Headcount | Announce | Dues)
  // Matching screenshot: Active tab is a bold black pill button!
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 flex justify-between items-center z-30 shadow-lg">
      {/* Tab 1: Headcount */}
      {ownerTab === 'headcount' ? (
        <button
          type="button"
          className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-xs transition-all"
        >
          <CookingPot className="w-4 h-4" strokeWidth={2.2} />
          <span>Headcount</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOwnerTab('headcount')}
          className="px-3 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
        >
          <CookingPot className="w-4 h-4" strokeWidth={1.8} />
          <span>Headcount</span>
        </button>
      )}

      {/* Tab 2: Announce */}
      {ownerTab === 'announce' ? (
        <button
          type="button"
          className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-xs transition-all"
        >
          <Megaphone className="w-4 h-4" strokeWidth={2.2} />
          <span>Announce</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOwnerTab('announce')}
          className="px-3 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
        >
          <Megaphone className="w-4 h-4" strokeWidth={1.8} />
          <span>Announce</span>
        </button>
      )}

      {/* Tab 3: Dues */}
      {ownerTab === 'dues' ? (
        <button
          type="button"
          className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-xs transition-all"
        >
          <Receipt className="w-4 h-4" strokeWidth={2.2} />
          <span>Dues</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOwnerTab('dues')}
          className="px-3 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
        >
          <Receipt className="w-4 h-4" strokeWidth={1.8} />
          <span>Dues</span>
        </button>
      )}
    </nav>
  );
};
