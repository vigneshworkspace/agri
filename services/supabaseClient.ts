import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Check if Supabase is properly configured
const isSupabaseConfigured = SUPABASE_URL && SUPABASE_ANON_KEY && 
    !SUPABASE_URL.includes('your-project') && 
    SUPABASE_URL.length > 10;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured - chat history will not be saved. This is fine for local development.');
}

// Create a mock client that does nothing when Supabase isn't configured
const createMockClient = (): SupabaseClient => {
    const mockResponse = { data: null, error: null };
    const mockQuery = () => ({
        select: () => mockQuery(),
        insert: () => Promise.resolve(mockResponse),
        update: () => Promise.resolve(mockResponse),
        delete: () => Promise.resolve(mockResponse),
        eq: () => mockQuery(),
        single: () => Promise.resolve(mockResponse),
        then: (resolve: any) => resolve(mockResponse),
    });
    
    return {
        from: () => mockQuery(),
        auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signIn: () => Promise.resolve({ data: null, error: null }),
            signOut: () => Promise.resolve({ error: null }),
        },
    } as unknown as SupabaseClient;
};

export const supabase = isSupabaseConfigured 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : createMockClient();

export const isSupabaseEnabled = isSupabaseConfigured;

export default supabase;
