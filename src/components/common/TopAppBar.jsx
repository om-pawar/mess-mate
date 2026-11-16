import React, { useRef, useEffect } from 'react';
import { Bell, User, LogOut, ArrowLeftRight, Shield, Sparkles } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const TopAppBar = () => {
  const {
    currentUserRole,
    student,
    switchRole,
    handleLogout,
    setIsNotificationOpen,
    unreadAnnouncementsCount,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
  } = useMess();

  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, setIsProfileMenuOpen]);

  const isOwner = currentUserRole === 'owner';

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
      {/* Brand & Badge */}
      <div className="flex items-center gap-2">
        <span className="text-slate-900 font-extrabold text-lg tracking-tight flex items-center gap-1.5">
          MessMate
        </span>
        {isOwner ? (
          <span className="bg-[#EFF6FF] text-[#1E40AF] border border-blue-100/90 rounded px-2 py-0.5 text-[11px] font-mono font-bold tracking-wider uppercase">
            OWNER CONSOLE
          </span>
        ) : (
          <span className="bg-[#EFF6FF] text-[#1E40AF] border border-blue-100/90 rounded px-2 py-0.5 text-[11px] font-mono font-medium">
            Room 304 • H-4
          </span>
        )}
      </div>

      {/* Right Actions: Notifications & Profile */}
      <div className="flex items-center gap-2.5 relative" ref={menuRef}>
        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
          title="Announcements & Alerts"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" strokeWidth={2} />
          {unreadAnnouncementsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#F8FAFC] animate-pulse" />
          )}
        </button>

        {/* User Profile Avatar Button */}
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
          title="Profile & Quick Switch"
          aria-label="Open profile options"
        >
          <User className="w-4 h-4" strokeWidth={2.2} />
        </button>

        {/* Profile / Role Switch Dropdown */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Identity info */}
            <div className="px-3 py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {isOwner ? 'M' : 'R'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {isOwner ? 'Mess In-Charge / Staff' : student.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {isOwner ? '@warden • Admin • Hostel 4 Mess' : `@${student.username || 'rohan'} • ${student.rollNo || '2022CSB1042'} • ${student.room || 'R-304'}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Role switch toggle */}
            <div className="p-1.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600 px-2 py-1 font-semibold">
                Switch Portal Role
              </p>
              <button
                onClick={() => switchRole(isOwner ? 'student' : 'owner')}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Switch to {isOwner ? 'Student View' : 'Owner Console'}</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  Toggle
                </span>
              </button>
            </div>

            {/* Logout button */}
            <div className="pt-1.5 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of MessMate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
