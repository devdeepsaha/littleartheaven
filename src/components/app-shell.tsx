"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RouteTransition } from "@/components/ui/route-transition";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#fffdf7_0%,#fef2f2_26%,#eff6ff_100%)] text-slate-900">
      {!isAdminRoute ? <SiteHeader /> : null}
      <main className="flex-1">
        <RouteTransition>{children}</RouteTransition>
      </main>
      {!isAdminRoute ? <SiteFooter /> : null}
    </div>
  );
}
