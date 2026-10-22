import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

// Public/browser client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey || supabaseServiceKey!)
  : null;

// Server-side service role client for privileged operations (e.g. secret creator answers)
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey || supabaseAnonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
