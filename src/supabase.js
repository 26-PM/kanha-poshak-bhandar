
import { createClient } from '@supabase/supabase-js';

// Access environment variables (best practice) or replace strings directly if testing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
