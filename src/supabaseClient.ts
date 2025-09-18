import { createClient } from "@supabase/supabase-js";

// Types for our database (optional but recommended)
export type LaundryOrder = {
  id: number;
  name: string;
  contact: string;
  clothes: string;
  status: string;
  created_at: string;
};

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey: string = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
