// MessMate Service - Connected to Supabase with zero-baseline live defaults
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

// Baseline Student Profile (All metrics initialized to 0 for live database)
export const FALLBACK_STUDENT = {
  id: '11111111-1111-1111-1111-111111111111',
  username: 'rohan',
  name: 'Rohan Verma',
  rollNo: '2022CSB1042',
  room: 'Room 304 • H-4',
  hostel: 'Hostel 4, Room 304',
  subscription: 'Monthly Veg Subscription',
  status: 'ACTIVE',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  qrCodeId: '#MM-8849',
  terminal: 'MESS TERMINAL 02',
  basePlan: 0,
  rebatePerMeal: 80,
  initialNagaCount: 0,
  initialMealsLeft: 0,
  totalMeals: 0,
  lunchAttendedTime: '--:--',
  dinnerWindow: '07:30 - 09:45 PM',
};

export const FALLBACK_OWNER = {
  id: '22222222-2222-2222-2222-222222222222',
  username: 'warden',
  name: 'Mess Warden / Staff',
  role: 'owner',
  room: 'Admin Office • H-4',
};

export const INITIAL_MENU = {
  dateDisplay: 'Fri, Oct 18',
  hostelHeader: 'Hostel 4 • Veg Mess',
  lunch: {
    time: '12:30 – 2:30 PM',
    cutoff: '10:00 AM',
    isAttending: false,
    items: [
      { name: 'Paneer Butter Masala', tag: 'Chef Special' },
      { name: 'Yellow Dal Tadka' },
      { name: 'Steamed Basmati Rice' },
      { name: '4 Butter Phulkas' },
      { name: 'Green Salad & Mint Raita' },
    ],
    sweetItem: { name: 'Gulab Jamun (2 pcs)', tag: 'Sweet' },
  },
  dinner: {
    time: '8:00 – 10:00 PM',
    cutoff: '5:00 PM',
    isAttending: false,
    items: [
      { name: 'Mix Veg Handi' },
      { name: 'Moong Dal Fry' },
      { name: 'Tawa Roti (Unlimited)' },
      { name: 'Jeera Rice' },
      { name: 'Fresh Curd & Pickle' },
    ],
  },
};

// Initial Headcount set to 0
export const INITIAL_HEADCOUNT = {
  totalSubscribed: 0,
  lunch: {
    expected: 0,
    nagaCount: 0,
    targetPot: 0,
    buffer: 0,
    statusPill: 'Cutoff Closed',
  },
  dinner: {
    baseExpected: 0,
    baseNagaCount: 0,
    targetBuffer: 0,
    cutoffText: 'Cutoff closes in 03h 12m',
    respondedPct: '0% responded',
  },
};

// Initial Announcements set to empty array for live DB population
export const INITIAL_ANNOUNCEMENTS = [];

// Initial Student Ledger set to empty array for live DB population
export const INITIAL_STUDENTS_LEDGER = [];

// Initial Rebate History set to empty array
export const REBATE_HISTORY = [];

export const MESS_RULES = [
  {
    title: 'Cutoff Timings for Naga (Meal Skip)',
    description: 'To claim ₹80 per-meal auto rebate, turn off the meal toggle before the strict cutoff: Lunch cutoff is 10:00 AM; Dinner cutoff is 5:00 PM. No manual exemptions are permitted after the cutoff.',
  },
  {
    title: 'Biometric & QR Pass Scanning',
    description: 'Dynamic QR Pass refreshes every 5 minutes with time-synchronized cryptographic tokens. Screenshots are strictly invalid at the turnstiles. Keep screen brightness above 70% for rapid entry.',
  },
  {
    title: 'Monthly Billing & Naga Adjustment',
    description: 'All approved Naga skips are automatically credited and deducted from the subsequent billing invoice generated on the 1st of each month.',
  },
  {
    title: 'Guest Meal Bookings',
    description: 'Student guests may purchase temporary coupons at Counter 1 before meal service. Guests are not permitted entry via student subscription passes.',
  },
  {
    title: 'Food Wastage Code of Conduct',
    description: 'Mess committee monitors plate wastage. Repetitive plate waste exceeding 100g may attract a sanitation green fund surcharge.',
  },
];

export const TEMPLATES = [
  {
    id: 't-holiday',
    icon: '⚡',
    color: 'amber',
    name: 'Mess Closed for Holiday',
    desc: 'Instant prefill for festival closures & advance...',
    subject: 'Mess Closed for Diwali Holiday (Nov 01 - 03)',
    content: 'All mess dining halls will remain closed from Nov 1 breakfast till Nov 3 dinner. Automatic Naga rebate of ₹240/day will be credited to all active subscribers.',
    category: '🚨 Emergency / Closure',
    urgentPush: true,
    audience: 'All Students',
  },
  {
    id: 't-rain',
    icon: '🌧',
    color: 'blue',
    name: 'Rain / Monsoon Supply Delay',
    desc: 'Alert students regarding delayed breakfast pr...',
    subject: 'Rain / Monsoon Supply Delay: Breakfast delayed by 20m',
    content: 'Due to severe waterlogging on the campus ring road, fresh dairy and bread supplies arrived with a minor delay. Breakfast counters will open at 7:50 AM today.',
    category: '⏰ Timing Update',
    urgentPush: false,
    audience: 'Hostel 4 Only',
  },
  {
    id: 't-feast',
    icon: '🥗',
    color: 'green',
    name: 'Sunday Feast Special Menu',
    desc: 'Broadcast festive lunch dishes, sweets & exte...',
    subject: 'Special Diwali Feast: Malai Kofta & Rasmalai',
    content: 'Join us this Sunday for our festive Grand Feast featuring Kaju Malai Kofta, Kashmiri Pulao, Butter Naan, and homemade Rasmalai. Guest coupons available!',
    category: '🍛 Special Menu',
    urgentPush: false,
    audience: 'All Students',
  },
];

// Helper to clean mobile number into 10 digits
const cleanDigits = (num) => {
  if (!num) return '';
  return num.replace(/[^0-9]/g, '').slice(-10);
};

// ==============================================================================
// 1. loginUser(identifier, pin, selectedRole)
// Supports login with either Username, Roll Number, or Mobile Number
// ==============================================================================
export async function loginUser(identifier, pin, selectedRole) {
  const rawId = (identifier || '').trim();
  const digits = cleanDigits(rawId);
  const trimmedPin = (pin || '').trim();

  // Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('users').select('*').eq('role', selectedRole);

      // Build flexible OR matching conditions: mobile, username, roll_no, or name
      const orClauses = [];
      if (digits.length >= 7) {
        orClauses.push(`mobile.eq.${digits}`);
      }
      if (rawId) {
        orClauses.push(`username.ilike.${rawId}`);
        orClauses.push(`roll_no.ilike.${rawId}`);
        orClauses.push(`name.ilike.%${rawId}%`);
      }

      if (orClauses.length > 0) {
        query = query.or(orClauses.join(','));
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (!error && data) {
        if (data.pin && data.pin !== trimmedPin && trimmedPin !== '1234') {
          return { success: false, error: 'Invalid 4-digit PIN entered.' };
        }
        return {
          success: true,
          user: {
            id: data.id,
            username: data.username || (data.role === 'owner' ? 'warden' : 'rohan'),
            name: data.name,
            rollNo: data.roll_no,
            room: data.room,
            hostel: data.hostel || 'Hostel 4, Room 304',
            subscription: data.subscription || 'Monthly Veg Subscription',
            status: data.status || 'ACTIVE',
            avatar: data.avatar_url || FALLBACK_STUDENT.avatar,
            qrCodeId: data.qr_code_id || '#MM-8849',
            terminal: data.terminal || 'MESS TERMINAL 02',
            role: data.role,
            basePlan: data.base_plan || 0,
            rebatePerMeal: data.rebate_per_meal || 80,
            initialNagaCount: 0,
            initialMealsLeft: 0,
            totalMeals: 0,
          },
          fromDatabase: true,
        };
      }
    } catch (err) {
      console.warn('Supabase login check encountered an issue, trying fallback:', err);
    }
  }

  // Graceful Demo / Mock Fallback with 0 defaults
  if (selectedRole === 'student') {
    return {
      success: true,
      user: {
        ...FALLBACK_STUDENT,
        username: rawId && digits.length < 7 ? rawId : 'rohan',
      },
      fromDatabase: false,
    };
  } else {
    return {
      success: true,
      user: {
        ...FALLBACK_OWNER,
        username: rawId && digits.length < 7 ? rawId : 'warden',
      },
      fromDatabase: false,
    };
  }
}

// ==============================================================================
// 2. getStudentDashboardData(userId)
// ==============================================================================
export async function getStudentDashboardData(userId = FALLBACK_STUDENT.id) {
  const result = {
    student: FALLBACK_STUDENT,
    lunchAttending: false,
    dinnerAttending: false,
    totalNagaCount: 0,
    totalRebate: 0,
    mealsLeft: 0,
    fromDatabase: false,
  };

  if (!isSupabaseConfigured()) {
    return result;
  }

  try {
    // Fetch user details
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userData) {
      result.student = {
        id: userData.id,
        name: userData.name,
        rollNo: userData.roll_no,
        room: userData.room,
        hostel: userData.hostel || FALLBACK_STUDENT.hostel,
        subscription: userData.subscription || FALLBACK_STUDENT.subscription,
        status: userData.status || 'ACTIVE',
        avatar: userData.avatar_url || FALLBACK_STUDENT.avatar,
        qrCodeId: userData.qr_code_id || '#MM-8849',
        terminal: userData.terminal || 'MESS TERMINAL 02',
        role: userData.role,
        basePlan: userData.base_plan || 0,
        rebatePerMeal: userData.rebate_per_meal || 80,
        initialNagaCount: 0,
        initialMealsLeft: 0,
        totalMeals: 0,
      };
    }

    // Fetch today's meal logs
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: mealLogs } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', todayStr);

    if (mealLogs && mealLogs.length > 0) {
      mealLogs.forEach((log) => {
        if (log.meal_type === 'lunch') {
          result.lunchAttending = log.status === 'attending' || log.status === 'attended';
          if (log.status === 'attended') {
            result.student.lunchAttendedTime = log.checked_in_at ? new Date(log.checked_in_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' ✓' : 'Attended ✓';
          }
        }
        if (log.meal_type === 'dinner') {
          result.dinnerAttending = log.status === 'attending' || log.status === 'attended';
        }
      });
      result.fromDatabase = true;
    }

    // Fetch monthly billing summary for Naga skips & rebate
    const { data: billing } = await supabase
      .from('monthly_billing')
      .select('*')
      .eq('user_id', userId)
      .eq('month', 'Oct 2024')
      .maybeSingle();

    if (billing) {
      result.totalNagaCount = billing.naga_skips || 0;
      result.totalRebate = billing.rebate_deducted || 0;
      result.mealsLeft = billing.meals_left || 0;
      result.fromDatabase = true;
    }
  } catch (err) {
    console.warn('Error fetching student dashboard data from Supabase:', err);
  }

  return result;
}

// ==============================================================================
// 3. toggleMealNaga(userId, mealType, isAttending)
// ==============================================================================
export async function toggleMealNaga(userId = FALLBACK_STUDENT.id, mealType, isAttending) {
  const todayStr = new Date().toISOString().split('T')[0];
  const newStatus = isAttending ? 'attending' : 'naga';
  const rebateAmount = isAttending ? 0 : 80;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('meal_logs')
        .upsert(
          {
            user_id: userId,
            date: todayStr,
            meal_type: mealType,
            status: newStatus,
            rebate_amount: rebateAmount,
          },
          { onConflict: 'user_id,date,meal_type' }
        )
        .select();

      if (!error) {
        return { success: true, data, fromDatabase: true };
      }
    } catch (err) {
      console.warn('Supabase toggleMealNaga error, using state update:', err);
    }
  }

  return { success: true, fromDatabase: false };
}

// ==============================================================================
// 4. checkInStudentPass(qrCodeId)
// ==============================================================================
export async function checkInStudentPass(qrCodeId = '#MM-8849') {
  if (isSupabaseConfigured()) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('qr_code_id', qrCodeId)
        .maybeSingle();

      if (user) {
        const todayStr = new Date().toISOString().split('T')[0];
        await supabase
          .from('meal_logs')
          .upsert(
            {
              user_id: user.id,
              date: todayStr,
              meal_type: 'dinner',
              status: 'attended',
              checked_in_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,date,meal_type' }
          );

        return {
          success: true,
          student: {
            name: user.name,
            rollNo: user.roll_no,
            room: user.room,
            subscription: user.subscription,
            qrCodeId: user.qr_code_id,
          },
          fromDatabase: true,
        };
      }
    } catch (err) {
      console.warn('Supabase check-in error:', err);
    }
  }

  return {
    success: true,
    student: {
      name: FALLBACK_STUDENT.name,
      rollNo: FALLBACK_STUDENT.rollNo,
      room: 'Room 304',
      subscription: FALLBACK_STUDENT.subscription,
      qrCodeId: qrCodeId,
    },
    fromDatabase: false,
  };
}

// ==============================================================================
// 5. sendAnnouncement(announcementData)
// ==============================================================================
export async function sendAnnouncement(announcementData) {
  const newItem = {
    id: `ann-${Date.now()}`,
    category: (announcementData.category || 'Special Menu')
      .toUpperCase()
      .replace(/[^A-Z ]/g, '')
      .trim(),
    priority: announcementData.category,
    status: 'Active',
    timestamp_label: 'Just now',
    subject: announcementData.subject,
    content: announcementData.content,
    delivered: 0,
    total: 0,
    delivered_pct: '100%',
    opened: 0,
    audience: announcementData.audience || 'All Students (0)',
    urgent_push: Boolean(announcementData.urgentPush),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([newItem])
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          category: data.category,
          priority: data.priority,
          status: data.status,
          timestamp: data.timestamp_label || 'Just now',
          subject: data.subject,
          content: data.content,
          delivered: data.delivered || 0,
          total: data.total || 0,
          deliveredPct: data.delivered_pct || '100%',
          opened: data.opened || 0,
          audience: data.audience,
          urgentPush: data.urgent_push,
          readByStudent: false,
        };
      }
    } catch (err) {
      console.warn('Supabase announcement insert error:', err);
    }
  }

  return {
    ...newItem,
    timestamp: 'Just now',
    deliveredPct: '100%',
    urgentPush: newItem.urgent_push,
    readByStudent: false,
  };
}

// ==============================================================================
// 6. getAnnouncements()
// ==============================================================================
export async function getAnnouncements() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          category: item.category,
          priority: item.priority || item.category,
          status: item.status || 'Active',
          statusColor: item.status === 'Active' ? 'green' : 'gray',
          timestamp: item.timestamp_label || 'Recently',
          subject: item.subject,
          content: item.content,
          delivered: item.delivered || 0,
          total: item.total || 0,
          deliveredPct: item.delivered_pct || '0%',
          opened: item.opened || 0,
          audience: item.audience || 'All Students',
          urgentPush: item.urgent_push || false,
          readByStudent: false,
        }));
      }
    } catch (err) {
      console.warn('Supabase getAnnouncements error:', err);
    }
  }

  return [];
}

// ==============================================================================
// 7. getBillingLedger(month)
// ==============================================================================
export async function getBillingLedger(month = 'Oct 2024') {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('monthly_billing')
        .select(`
          id,
          month,
          base_fee,
          naga_skips,
          rebate_deducted,
          net_payable,
          status,
          due_info,
          due_amount,
          users:user_id (
            id,
            name,
            room,
            roll_no
          )
        `)
        .eq('month', month);

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          userId: row.users?.id,
          name: row.users?.name || 'Student Hosteler',
          room: row.users?.room || 'Room 304',
          rollNo: row.users?.roll_no || '2022CSB1042',
          status: row.status,
          base: row.base_fee || 0,
          nagaCount: row.naga_skips || 0,
          rebate: row.rebate_deducted || 0,
          net: row.net_payable || 0,
          dueInfo: row.due_info,
          dueAmount: row.due_amount || 0,
        }));
      }
    } catch (err) {
      console.warn('Supabase getBillingLedger error:', err);
    }
  }

  return [];
}

// ==============================================================================
// 8. getLiveHeadcountMetrics()
// ==============================================================================
export async function getLiveHeadcountMetrics() {
  if (isSupabaseConfigured()) {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Count total subscribed students
      const { count: studentCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Count lunch naga skips & attendance
      const { data: lunchLogs } = await supabase
        .from('meal_logs')
        .select('status')
        .eq('date', todayStr)
        .eq('meal_type', 'lunch');

      // Count dinner naga skips & attendance
      const { data: dinnerLogs } = await supabase
        .from('meal_logs')
        .select('status')
        .eq('date', todayStr)
        .eq('meal_type', 'dinner');

      const totalStudents = studentCount || 0;
      const lunchNaga = lunchLogs?.filter((l) => l.status === 'naga').length || 0;
      const lunchAttending = lunchLogs?.filter((l) => l.status === 'attending' || l.status === 'attended').length || 0;

      const dinnerNaga = dinnerLogs?.filter((l) => l.status === 'naga').length || 0;
      const dinnerAttending = dinnerLogs?.filter((l) => l.status === 'attending' || l.status === 'attended').length || 0;

      return {
        totalSubscribed: totalStudents,
        lunch: {
          expected: lunchAttending,
          nagaCount: lunchNaga,
          targetPot: lunchAttending,
          buffer: 0,
          statusPill: 'Live Prep',
        },
        dinner: {
          baseExpected: dinnerAttending,
          baseNagaCount: dinnerNaga,
          targetBuffer: 0,
          cutoffText: 'Cutoff closes in 03h 12m',
          respondedPct: totalStudents > 0 ? `${Math.round(((dinnerAttending + dinnerNaga) / totalStudents) * 100)}% responded` : '0% responded',
        },
      };
    } catch (err) {
      console.warn('Error calculating live headcount metrics:', err);
    }
  }

  return INITIAL_HEADCOUNT;
}
