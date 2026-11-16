import { createClient } from '@supabase/supabase-js';

// Extract and sanitize Supabase URL & Anon Key from Vite environment variables
let envUrl = import.meta.env.VITE_SUPABASE_URL || '';
let envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean up if user accidentally pasted dashboard URL like:
// https://supabase.com/dashboard/project/khfuhlizabsgdpptpofv/sql/...
if (envUrl && envUrl.includes('supabase.com/dashboard/project/')) {
  const match = envUrl.match(/project\/([a-zA-Z0-9]+)/);
  if (match && match[1]) {
    envUrl = `https://${match[1]}.supabase.co`;
  }
}

// Ensure valid fallback URL structure for createClient
const validUrl = envUrl.startsWith('http') ? envUrl : 'https://placeholder.supabase.co';
const validKey = envAnonKey || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    Boolean(envUrl) &&
    Boolean(envAnonKey) &&
    !envUrl.includes('placeholder') &&
    envAnonKey !== 'placeholder-anon-key'
  );
};

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const sanitizedSupabaseUrl = envUrl;
