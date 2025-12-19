"use client";

import { useEffect, use, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, getSubscriptionType } from "@/lib/auth-utils";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { LogoutButton } from "@/components/providers/logout-button";
import { CreditDisplay } from "@/components/common/credit-display";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function ProtectedLayout({ children, params }) {
  const { locale } = use(params);
  const router = useRouter();
  const user = getCurrentUser();
  const subscriptionType = getSubscriptionType();
  const [mounted, setMounted] = useState(false);
  const pathnameHook = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      if (typeof window === "undefined") return;

      try {
        // lightweight debug to help trace transient redirects
        // eslint-disable-next-line no-console
        console.debug("ProtectedLayout: user missing on mount", {
          user,
          authToken: localStorage.getItem("authToken"),
          cookies: document.cookie,
        });
      } catch (e) {}

      // If there's evidence of an auth token or role cookie, wait briefly
      // to allow client-side auth writes to settle (prevents immediate redirect
      // after actions that set localStorage/cookies).
      const hasToken =
        (typeof window !== "undefined" && !!localStorage.getItem("authToken")) ||
        (typeof document !== "undefined" && document.cookie.includes("userRole="));

      if (hasToken) {
        const timer = setTimeout(() => {
          const fresh = getCurrentUser();
          if (!fresh) router.push(`/${locale}/login`);
        }, 200);
        return () => clearTimeout(timer);
      }

      router.push(`/${locale}/login`);
    }
  }, [user, router, locale]);

  useEffect(() => {
    if (!user) return;

    try {
      // debug role enforcement checks
      // eslint-disable-next-line no-console
      console.debug("ProtectedLayout: role check", { user, pathname: pathnameHook });
    } catch (e) {}

    const pathname = pathnameHook || (typeof window !== "undefined" ? window.location.pathname : "");
    if (!pathname) return;

    const parts = pathname.split("/").filter(Boolean);
    const LOCALES = ["zh","ms","th","vi","id","ko","ja","hi","ar","en"];
    const routeSegment = LOCALES.includes(parts[0]) ? parts[1] || "" : parts[0] || "";

    // Client-side role enforcement on route segment
    if (routeSegment.startsWith("merchant") && user.role !== "merchant") {
      router.push(`/${locale}/login`);
      return;
    }

    if ((routeSegment.startsWith("agent") || routeSegment.startsWith("admin")) && !(user.role === "agent" || user.role === "admin")) {
      router.push(`/${locale}/login`);
      return;
    }
  }, [user, router, locale, pathnameHook]);

  if (!mounted || !user) {
    return null; // Or a loading spinner
  }

  // Dummy credit balance for merchants
  const merchantCredits = 2500;

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} subscriptionType={subscriptionType} />
      <SidebarInset>
        <div>
          <header className="flex items-center justify-between px-6 py-3 border-b border-sidebar-border bg-white">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 rounded-lg p-2 transition-all duration-200" />
              <Separator orientation="vertical" className="h-6 bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">QR Scanner</h1>
            </div>
            <div className="flex items-center gap-4">
              {user.role === "merchant" && (
                <CreditDisplay credits={merchantCredits} />
              )}
              <LanguageSwitcher />
              <LogoutButton />
            </div>
          </header>
        </div>
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
