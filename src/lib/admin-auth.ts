import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
  hasSupabaseConfig,
} from "@/lib/supabase-server";

export async function requireAdminSession() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email || null;

  if (!email) {
    redirect("/admin/login");
  }

  return email;
}
