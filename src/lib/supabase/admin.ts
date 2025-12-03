import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client is for server-side use only and bypasses all RLS policies.
// Never expose this to the client.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey && process.env.NODE_ENV === 'production') {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin features will fail.');
}

export const admin = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
