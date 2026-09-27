import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables! Check your .env file.');
}

// Public client (for regular users)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Admin client — uses anon key (Supabase blocks service_role key in browser)
// RLS policies in Supabase allow anon users to perform all operations
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase initialized:', supabaseUrl ? '✅ Connected' : '❌ Missing URL');
}
