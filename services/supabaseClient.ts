import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set. Supabase client will still be created but requests will fail.');
}

/**
 * The default, anonymous Supabase client instance.
 * This client is used for unauthenticated requests or when a user-specific token is not available.
 * It is configured to not persist sessions automatically.
 * @type {SupabaseClient}
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

/**
 * Creates a new Supabase client instance authenticated with a Clerk-provided JWT.
 * This should be used for requests that require user authentication, respecting Row Level Security (RLS) policies.
 * If no token is provided, it returns the default anonymous client.
 *
 * @param {string} [clerkToken] - The JWT token obtained from the authenticated Clerk user session.
 * @returns {Promise<SupabaseClient>} A Supabase client instance configured with the user's authorization token.
 */
export async function createSupabaseClient(clerkToken?: string): Promise<SupabaseClient> {
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
