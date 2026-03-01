import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cxifhyyrfvkvnfxjiuwt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RvTCO44dL5LN_yq7k-2a1A_ih445FKo';

// Provide dummy values if the environment variables are missing so the app doesn't crash on startup.
// The user will see errors when trying to use Supabase features, but the app will load.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
