import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  FALLBACK_STUDENT,
  FALLBACK_OWNER,
  INITIAL_MENU,
  INITIAL_HEADCOUNT,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_STUDENTS_LEDGER,
  REBATE_HISTORY,
  MESS_RULES,
  getStudentDashboardData,
  toggleMealNaga as serviceToggleNaga,
  checkInStudentPass as serviceCheckIn,
  sendAnnouncement as serviceSendAnnouncement,
  getAnnouncements as serviceGetAnnouncements,
  getBillingLedger as serviceGetBillingLedger,
  getLiveHeadcountMetrics,
} from '../services/messService';

const MessContext = createContext(null);

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};

export const MessProvider = ({ children }) => {
  // Authentication & Current User
  const [currentUserRole, setCurrentUserRole] = useState(null); // 'student' | 'owner' | null
  const [authenticatedUser, setAuthenticatedUser] = useState(FALLBACK_STUDENT);

  // Tab navigation
  const [studentTab, setStudentTab] = useState('today-menu'); // 'today-menu' | 'mess-pass'
  const [ownerTab, setOwnerTab] = useState('headcount'); // 'headcount' | 'announce' | 'dues'

  // Student Menu Toggles (Lunch & Dinner) - default to false for clean state
  const [lunchAttending, setLunchAttending] = useState(false);
  const [dinnerAttending, setDinnerAttending] = useState(false);

  // Base Naga counts loaded from DB - initialized to 0
  const [baseNagaCount, setBaseNagaCount] = useState(0);
  const [baseRebate, setBaseRebate] = useState(0);
  const [baseMealsLeft, setBaseMealsLeft] = useState(0);

  // Headcount state initialized to 0
  const [liveHeadcount, setLiveHeadcount] = useState(INITIAL_HEADCOUNT);

  // Yesterday's Dinner Rating
  const [yesterdayRating, setYesterdayRating] = useState(0);

  // Live QR Pass Countdown & Clock
  const [qrCountdown, setQrCountdown] = useState(265);
  const [currentTimeIST, setCurrentTimeIST] = useState('');

  // Announcements State - empty array initially
  const [announcements, setAnnouncements] = useState([]);

  // Ledger & Dues State - empty array initially
  const [ledger, setLedger] = useState([]);
  const [ledgerFilter, setLedgerFilter] = useState('All');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Modals & Drawers
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isRebateModalOpen, setIsRebateModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data from Supabase
  const refreshLiveMetrics = useCallback(async () => {
    try {
      const [fetchedAnnouncements, fetchedLedger, fetchedHeadcount] = await Promise.all([
        serviceGetAnnouncements(),
        serviceGetBillingLedger('Oct 2024'),
        getLiveHeadcountMetrics(),
      ]);

      setAnnouncements(fetchedAnnouncements || []);
      setLedger(fetchedLedger || []);
      if (fetchedHeadcount) {
        setLiveHeadcount(fetchedHeadcount);
      }
    } catch (err) {
      console.warn('Live data refresh:', err);
    }
  }, []);

  useEffect(() => {
    refreshLiveMetrics();
  }, [refreshLiveMetrics]);

  // Load student dashboard data when student logs in
  useEffect(() => {
    if (currentUserRole === 'student' && authenticatedUser?.id) {
      const loadStudentData = async () => {
        try {
          const dash = await getStudentDashboardData(authenticatedUser.id);
          if (dash.student) {
            setAuthenticatedUser((prev) => ({ ...prev, ...dash.student }));
          }
          setLunchAttending(Boolean(dash.lunchAttending));
          setDinnerAttending(Boolean(dash.dinnerAttending));
          setBaseNagaCount(dash.totalNagaCount || 0);
          setBaseRebate(dash.totalRebate || 0);
          setBaseMealsLeft(dash.mealsLeft || 0);
        } catch (err) {
          console.warn('Error loading student dashboard from Supabase:', err);
        }
      };
      loadStudentData();
    }
  }, [currentUserRole, authenticatedUser?.id]);

  // Subscribe to Supabase Realtime changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let channel;
    try {
      channel = supabase
        .channel('messmate-realtime-live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'meal_logs' },
          (payload) => {
            console.log('Realtime meal_logs change:', payload);
            refreshLiveMetrics();

            if (payload.new?.user_id === authenticatedUser?.id) {
              if (payload.new.meal_type === 'lunch') {
                setLunchAttending(payload.new.status === 'attending' || payload.new.status === 'attended');
              } else if (payload.new.meal_type === 'dinner') {
                setDinnerAttending(payload.new.status === 'attending' || payload.new.status === 'attended');
              }
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'announcements' },
          () => {
            refreshLiveMetrics();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'monthly_billing' },
          () => {
            refreshLiveMetrics();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription error:', err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [authenticatedUser?.id, refreshLiveMetrics]);

  // Timer: 5-minute countdown for QR code refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) return 300;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedCountdown = useMemo(() => {
    const mins = Math.floor(qrCountdown / 60);
    const secs = qrCountdown % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [qrCountdown]);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTimeIST(`${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Total Naga Skips & Rebate calculated from base + current meal toggles
  const totalNagaCount = baseNagaCount;
  const totalRebate = baseRebate;
  const mealsLeft = baseMealsLeft;

  // Headcount numbers
  const lunchHeadcount = liveHeadcount.lunch;
  const dinnerHeadcount = liveHeadcount.dinner;
  const totalSubscribed = liveHeadcount.totalSubscribed;

  // Filtered ledger based on search and tab
  const filteredLedger = useMemo(() => {
    return ledger.filter((item) => {
      if (ledgerFilter === 'Overdue' && item.status !== 'OVERDUE' && item.status !== 'DUE') {
        return false;
      }
      if (ledgerFilter === 'Clear' && item.status !== 'PAID') {
        return false;
      }
      if (ledgerSearch.trim()) {
        const q = ledgerSearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchRoll = item.rollNo?.toLowerCase().includes(q);
        const matchRoom = item.room?.toLowerCase().includes(q);
        return matchName || matchRoll || matchRoom;
      }
      return true;
    });
  }, [ledger, ledgerFilter, ledgerSearch]);

  // Toggle Lunch Naga
  const handleToggleLunch = async () => {
    const next = !lunchAttending;
    setLunchAttending(next);
    
    // Optimistic / Real-time calculation
    if (!next) {
      setBaseNagaCount((prev) => prev + 1);
      setBaseRebate((prev) => prev + 80);
      setLiveHeadcount((prev) => ({
        ...prev,
        lunch: {
          ...prev.lunch,
          expected: Math.max(0, prev.lunch.expected - 1),
          nagaCount: prev.lunch.nagaCount + 1,
          targetPot: Math.max(0, prev.lunch.targetPot - 1),
        },
      }));
    } else {
      setBaseNagaCount((prev) => Math.max(0, prev - 1));
      setBaseRebate((prev) => Math.max(0, prev - 80));
      setLiveHeadcount((prev) => ({
        ...prev,
        lunch: {
          ...prev.lunch,
          expected: prev.lunch.expected + 1,
          nagaCount: Math.max(0, prev.lunch.nagaCount - 1),
          targetPot: prev.lunch.targetPot + 1,
        },
      }));
    }

    addToast(
      next ? 'Lunch Opted In' : 'Naga Marked for Lunch',
      next
        ? 'You are now marked ATTENDING for lunch.'
        : 'Lunch skipped! ₹80 auto-rebate added to your account.',
      next ? 'info' : 'success'
    );

    await serviceToggleNaga(authenticatedUser.id, 'lunch', next);
    refreshLiveMetrics();
  };

  // Toggle Dinner Naga
  const handleToggleDinner = async () => {
    const next = !dinnerAttending;
    setDinnerAttending(next);

    if (!next) {
      setBaseNagaCount((prev) => prev + 1);
      setBaseRebate((prev) => prev + 80);
      setLiveHeadcount((prev) => ({
        ...prev,
        dinner: {
          ...prev.dinner,
          baseExpected: Math.max(0, prev.dinner.baseExpected - 1),
          baseNagaCount: prev.dinner.baseNagaCount + 1,
        },
      }));
    } else {
      setBaseNagaCount((prev) => Math.max(0, prev - 1));
      setBaseRebate((prev) => Math.max(0, prev - 80));
      setLiveHeadcount((prev) => ({
        ...prev,
        dinner: {
          ...prev.dinner,
          baseExpected: prev.dinner.baseExpected + 1,
          baseNagaCount: Math.max(0, prev.dinner.baseNagaCount - 1),
        },
      }));
    }

    addToast(
      next ? 'Dinner Opted In' : 'Naga Marked for Dinner',
      next
        ? 'You are now marked ATTENDING for tonight’s dinner.'
        : 'Dinner skipped! ₹80 auto-rebate added to your account.',
      next ? 'info' : 'success'
    );

    await serviceToggleNaga(authenticatedUser.id, 'dinner', next);
    refreshLiveMetrics();
  };

  const handleRateYesterday = (stars) => {
    setYesterdayRating(stars);
    addToast(
      'Rating Submitted',
      `Thank you for rating dinner ${stars} star${stars > 1 ? 's' : ''}! Feedback shared with mess committee.`,
      'success'
    );
  };

  const handleSendBroadcast = async (newBroadcast) => {
    const created = await serviceSendAnnouncement(newBroadcast);
    setAnnouncements((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
    addToast(
      'Broadcast Dispatched 🚀',
      `Sent to ${newBroadcast.audience} with ${newBroadcast.urgentPush ? 'High-Priority Alert' : 'Standard Push'}.`,
      'success'
    );
    refreshLiveMetrics();
  };

  const handleSendPaymentReminders = () => {
    const overdueCount = ledger.filter((s) => s.status === 'OVERDUE' || s.status === 'DUE').length;
    addToast(
      'Payment Reminders Sent 📲',
      `Batch notices dispatched to ${overdueCount} students with pending balances.`,
      'success'
    );
  };

  const handleSendSingleReminder = (studentName, dueAmount) => {
    addToast(
      'Reminder Dispatched',
      `Instant payment link for ₹${dueAmount} sent to ${studentName}'s mobile.`,
      'info'
    );
  };

  const handleCheckInScan = async (scannedCode) => {
    const res = await serviceCheckIn(scannedCode);
    if (res.success) {
      addToast(
        'Pass Verified ✓',
        `${res.student.name} (${res.student.rollNo || scannedCode}) checked in successfully at Terminal 02.`,
        'success'
      );
      refreshLiveMetrics();
    }
    return res;
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setAuthenticatedUser(FALLBACK_STUDENT);
    setIsProfileMenuOpen(false);
    addToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const switchRole = (newRole) => {
    setCurrentUserRole(newRole);
    setIsProfileMenuOpen(false);
    if (newRole === 'student') {
      setAuthenticatedUser(FALLBACK_STUDENT);
      setStudentTab('today-menu');
    } else {
      setAuthenticatedUser(FALLBACK_OWNER);
      setOwnerTab('headcount');
    }
    addToast('Role Switched', `Now viewing as ${newRole === 'student' ? 'Student' : 'Mess Staff / Owner'}.`, 'info');
  };

  const markAllAnnouncementsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, readByStudent: true })));
  };

  const unreadAnnouncementsCount = useMemo(() => {
    return announcements.filter((a) => !a.readByStudent).length;
  }, [announcements]);

  const value = {
    // Auth & Role
    currentUserRole,
    setCurrentUserRole,
    authenticatedUser,
    setAuthenticatedUser,
    switchRole,
    handleLogout,

    // Tabs
    studentTab,
    setStudentTab,
    ownerTab,
    setOwnerTab,

    // Student Data
    student: authenticatedUser || FALLBACK_STUDENT,
    lunchAttending,
    dinnerAttending,
    handleToggleLunch,
    handleToggleDinner,
    totalNagaCount,
    totalRebate,
    mealsLeft,
    yesterdayRating,
    handleRateYesterday,
    formattedCountdown,
    currentTimeIST,
    rebateHistory: REBATE_HISTORY,
    messRules: MESS_RULES,

    // Owner Data
    totalSubscribed,
    lunchHeadcount,
    dinnerHeadcount,
    announcements,
    handleSendBroadcast,
    ledger,
    filteredLedger,
    ledgerFilter,
    setLedgerFilter,
    ledgerSearch,
    setLedgerSearch,
    handleSendPaymentReminders,
    handleSendSingleReminder,
    handleCheckInScan,
    refreshLiveMetrics,

    // Modals
    isScannerOpen,
    setIsScannerOpen,
    isRebateModalOpen,
    setIsRebateModalOpen,
    isRulesModalOpen,
    setIsRulesModalOpen,
    isBillingModalOpen,
    setIsBillingModalOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    markAllAnnouncementsRead,
    unreadAnnouncementsCount,

    // Toasts
    toasts,
    addToast,
    removeToast,
  };

  return <MessContext.Provider value={value}>{children}</MessContext.Provider>;
};
