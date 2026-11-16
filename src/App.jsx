import React from 'react';
import { MessProvider, useMess } from './context/MessContext';
import { LoginView } from './components/auth/LoginView';
import { TopAppBar } from './components/common/TopAppBar';
import { BottomTabBar } from './components/common/BottomTabBar';
import { ToastContainer } from './components/common/ToastContainer';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Student screens & modals
import { TodayMenuTab } from './components/student/TodayMenuTab';
import { MessPassTab } from './components/student/MessPassTab';
import { RebateStatementModal } from './components/student/RebateStatementModal';
import { MessRulesModal } from './components/student/MessRulesModal';

// Owner screens & modals
import { HeadcountTab } from './components/owner/HeadcountTab';
import { AnnounceTab } from './components/owner/AnnounceTab';
import { DuesTab } from './components/owner/DuesTab';
import { CounterQRScannerModal } from './components/owner/CounterQRScannerModal';
import { BillingSheetModal } from './components/owner/BillingSheetModal';

const MainPortal = () => {
  const { currentUserRole, studentTab, ownerTab } = useMess();

  if (!currentUserRole) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      {/* Mobile-first viewport container (430px) */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[880px] bg-[#F8FAFC] relative pb-24 shadow-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col">
        {/* Shared Top App Bar */}
        <TopAppBar />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {currentUserRole === 'student' ? (
            <>
              {studentTab === 'today-menu' && <TodayMenuTab />}
              {studentTab === 'mess-pass' && <MessPassTab />}
            </>
          ) : (
            <>
              {ownerTab === 'headcount' && <HeadcountTab />}
              {ownerTab === 'announce' && <AnnounceTab />}
              {ownerTab === 'dues' && <DuesTab />}
            </>
          )}
        </main>

        {/* Bottom Tab Bar */}
        <BottomTabBar />

        {/* Floating Role Quick Switcher Pill for Testing */}
        <div className="fixed top-3 right-3 hidden lg:flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs shadow-lg border border-slate-700 z-50">
          <span className="text-slate-400">Current:</span>
          <span className="font-bold uppercase tracking-wider text-emerald-400">
            {currentUserRole === 'student' ? 'Student' : 'Owner'}
          </span>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <NotificationDrawer />
      <RebateStatementModal />
      <MessRulesModal />
      <CounterQRScannerModal />
      <BillingSheetModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <MessProvider>
      <MainPortal />
    </MessProvider>
  );
}

export default App;
