import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseURL || !supabaseKey) {
  throw new Error("Missing required environment variables: SUPABASE_URL and SUPABASE_KEY");
}

const supabase = createClient(supabaseURL, supabaseKey);

export default supabase;