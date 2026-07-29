import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import {
  hasSupabaseConfig,
  serviceRoleKey,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase-config";

export { hasSupabaseConfig };

export async function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        // In ordinary Server Components, Next.js allows reading cookies but
        // rejects writes. Supabase may still attempt to refresh session
        // cookies, so we swallow those writes outside actions/route handlers.
        try {
          items.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // No-op when cookie mutation is not allowed in the current context.
        }
      },
    },
  });
}

export async function createSupabaseAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured.");
  }

  const { createClient } = await import("@supabase/supabase-js");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
