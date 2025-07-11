import { createClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase client instance using env vars.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

// Validate env
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase URL or KEY missing! Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set in .env'
  );
}

// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
