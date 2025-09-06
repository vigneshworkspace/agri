import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set. Supabase client will still be created but requests will fail.');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Function to create authenticated client with Clerk token
export async function createSupabaseClient(clerkToken?: string) {
  if (!clerkToken) {
    console.warn('No Clerk token provided, using anonymous client');
    return supabase;
  }

  return createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

export default supabase;
