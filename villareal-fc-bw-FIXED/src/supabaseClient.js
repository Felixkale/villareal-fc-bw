import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Missing Supabase env vars. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    // Automatically detect and handle the token from the URL hash
    // This fires when user clicks the confirmation link in email
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  }
})
