import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Sparkles, CheckCheck } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const NotificationDrawer = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    announcements,
    markAllAnnouncementsRead,
  } = useMess();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white max-w-[380px] w-full h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Announcements & Alerts
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Hostel 4 Central Dining Broadcasts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark as read bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 font-medium">
            {announcements.length} notices on noticeboard
          </span>
          <button
            onClick={markAllAnnouncementsRead}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Announcements List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                    item.category.includes('EMERGENCY')
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.timestamp}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-xs">
                {item.subject}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.content}
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Audience: {item.audience}</span>
                {item.urgentPush && (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <span>⚡ Audible alert</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Close footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Noticeboard
          </button>
        </div>
      </div>
    </div>
  );
};
