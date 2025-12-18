"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  DollarSign,
  FileText,
  RefreshCw,
  MessageSquare,
  Ticket,
  Hash,
  Megaphone,
  Gift,
  BarChart3,
  Database,
  Settings,
} from "lucide-react";
import { useLocale } from "next-intl";
import { getTextDirection } from "@/i18n/routing";
import { NavMain } from "@/components/layouts/nav-main";
import { NavUser } from "@/components/layouts/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ role = "agent", subscriptionType = "temporary", ...props }) {
  const locale = useLocale();
  const direction = getTextDirection(locale);
  const isRTL = direction === "rtl";

  // Agent navigation
  const agentNav = [
    {
      title: "Dashboard",
      url: "/agent/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Merchants",
      url: "/agent/merchants",
      icon: Users,
    },
    {
      title: "Wallet",
      url: "/agent/wallet",
      icon: Wallet,
    },
    {
      title: "Earnings",
      url: "/agent/earnings",
      icon: DollarSign,
    },
    {
      title: "Statements",
      url: "/agent/statements",
      icon: FileText,
    },
    {
      title: "Coupon Sync",
      url: "/agent/coupon-sync",
      icon: RefreshCw,
    },
    {
      title: "Support",
      url: "/agent/support",
      icon: MessageSquare,
    },
  ];

  // Merchant navigation
  const merchantNav = [
    {
      title: "Dashboard",
      url: "/merchant/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Coupons",
      url: "/merchant/coupons",
      icon: Ticket,
    },
    {
      title: "Serial Codes",
      url: "/merchant/serial-codes",
      icon: Hash,
    },
    {
      title: "Wallet",
      url: "/merchant/wallet",
      icon: Wallet,
    },
    {
      title: "Campaigns",
      url: "/merchant/campaigns",
      icon: Megaphone,
    },
    {
      title: "Lucky Draw",
      url: "/merchant/lucky-draw",
      icon: Gift,
    },
    {
      title: "Analytics",
      url: "/merchant/analytics",
      icon: BarChart3,
    },
    // Only show Customer Data for annual subscribers
    ...(subscriptionType === "annual" ? [{
      title: "Customer Data",
      url: "/merchant/customer-data",
      icon: Database,
    }] : []),
    {
      title: "Ads",
      url: "/merchant/ads",
      icon: Settings,
    },
  ];

  const navItems = role === "agent" ? agentNav : merchantNav;

  const userData = {
    name: role === "agent" ? "Agent Admin" : "Merchant User",
    email: role === "agent" ? "agent@qrscanner.com" : "merchant@qrscanner.com",
    avatar: "/images/avatar.jpg",
  };

  return (
    <Sidebar collapsible="icon" side={isRTL ? "right" : "left"} {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <h1 className="text-lg font-semibold">QR Scanner</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

