import { LoginForm } from "@/components/admin/login-form";
import { hasSupabaseConfig } from "@/lib/supabase-server";

export default function AdminLoginPage() {
  return (
    <section className="site-shell py-16">
      <div className="mx-auto max-w-lg rounded-[2.25rem] bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Admin sign-in</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Welcome back, Srijita
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use the single admin account to manage products and orders.
        </p>
        {hasSupabaseConfig() ? (
          <div className="mt-8">
            <LoginForm />
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Supabase credentials are not set yet. Add them in `.env.local` using `.env.example`, then create the admin user in Supabase Auth.
          </div>
        )}
      </div>
    </section>
  );
}
