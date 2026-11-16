import { createClient } from "@supabase/supabase-js";

// Publika värden – publishable key är gjord för att ligga i frontend.
// Hemliga nycklar (secret / service_role) får ALDRIG läggas här.
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabasePublishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as
  string | undefined;

/** false t.ex. i Lovables förhandsvisning där .env.local saknas. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// Den enda Supabase-klienten i appen.
// Placeholder-värdena gör att appen kan starta (och visa ett tydligt fel)
// även när miljövariablerna saknas, i stället för att krascha.
export const supabase = createClient(
  supabaseUrl ?? "https://not-configured.invalid",
  supabasePublishableKey ?? "not-configured",
  {
    auth: {
      persistSession: true, // sessionen sparas -> inloggad efter omladdning
      autoRefreshToken: true, // ny access token innan den gamla går ut
      detectSessionInUrl: true, // hanterar länken i bekräftelsemejlet
      flowType: "pkce",
    },
  },
);
