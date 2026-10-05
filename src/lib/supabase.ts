import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://jjuiaxxlrtomvdtpmujy.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_D3cQNLWcRusyFkOdxolCbw_3AMwgliR'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'matchapoint-auth',
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})
