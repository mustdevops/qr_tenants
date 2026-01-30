"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import {
  Layers,
  CheckCircle,
  MessageCircle,
  Users,
  Trophy,
  Star,
  TrendingUp,
  UserPlus,
  Gift,
  MessageSquare,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

// SVG Pie Chart moved outside component to avoid recreating component during render
function CouponPieChart({ couponStats }) {
  // Handle multiple possible data structures from API response
  const byStatus = couponStats?.byStatus || {};
  const issued =
    Number(byStatus?.issued) || Number(couponStats?.totalCouponsIssued) || 0;
  const redeemed =
    Number(byStatus?.redeemed) ||
    Number(couponStats?.totalCouponsRedeemed) ||
    0;

  // Calculate unredeemed
  const unredeemed = issued - redeemed;

  const data = [
    {
      label: "Redeemed",
      value: redeemed,
      color: "#10b981",
    }, // green
    {
      label: "Unredeemed",
      value: unredeemed,
      color: "#f59e0b",
    }, // amber
  ].filter((item) => item.value > 0);

  const total = redeemed + unredeemed;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">No coupons issued yet</p>
      </div>
    );
  }

  const radius = 40;
  const centerX = 50;
  const centerY = 50;
  let startAngle = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 100 100">
        {data.length === 1 ? (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={data[0].color}
            stroke="#fff"
            strokeWidth="2"
          />
        ) : (
          data.map((item, index) => {
            if (item.value === 0) return null;
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const angle = (percentage / 100) * Math.PI * 2;
            const endAngle = startAngle + angle;

            // Calculate the path for the pie slice
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            // Determine if the arc is large or small
            const largeArcFlag = angle > Math.PI ? "1" : "0";

            // Create the path data
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            startAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })
        )}
      </svg>

      {/* Legend */}
      <div className="w-full space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-bold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const platformColors = {
  google: "bg-blue-500",
  facebook: "bg-blue-700",
  instagram: "bg-pink-600",
  xiaohongshu: "bg-red-500",
};

function FeedbackBreakdown({ stats }) {
  const byPlatform = stats?.byPlatform || {};
  const total = stats?.totalReviews || 0;

  if (total === 0)
    return (
      <p className="text-xs text-muted-foreground">No feedback data yet</p>
    );

  return (
    <div className="space-y-3 mt-4">
      {Object.entries(byPlatform)
        .filter(([_, value]) => value > 0)
        .map(([platform, value]) => {
          const percentage = (value / total) * 100;
          return (
            <div key={platform} className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                <span>{platform}</span>
                <span>
                  {value} ({Math.round(percentage)}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full",
                    platformColors[platform] || "bg-primary",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}

function TopCustomersList({ customers }) {
  if (!customers || customers.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No customer data yet</p>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {customers.map((customer, i) => (
        <div
          key={customer.customerId || i}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {customer.customerName?.charAt(0) || "C"}
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                {customer.customerName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {customer.totalVisits} visits
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold">
              {customer.totalCouponsRedeemed || 0}
            </p>
            <p className="text-[8px] text-muted-foreground uppercase">
              Redeemed
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WhatsAppBreakdown({ stats }) {
  const ui = stats?.uiMessages || {};
  const bi = stats?.biMessages || {};

  const uiItems = [
    { label: "Feedback Coupons", value: ui.feedbackCoupons ?? 0 },
    { label: "Lucky Draw Wins", value: ui.luckyDrawWins ?? 0 },
    { label: "Homepage Coupons", value: ui.homepageCoupons ?? 0 },
  ].filter((i) => i.value > 0);

  const biItems = [
    { label: "Birthday Campaigns", value: bi.birthdayCampaigns ?? 0 },
    { label: "Inactive Recalls", value: bi.inactiveRecalls ?? 0 },
    { label: "Festival Campaigns", value: bi.festivalCampaigns ?? 0 },
  ].filter((i) => i.value > 0);

  return (
    <div className="space-y-4 mt-4">
      {/* UI Section */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold uppercase text-violet-600">
            UI Messages (User-Initiated)
          </span>
          <span className="text-xs font-bold">{ui.total ?? 0}</span>
        </div>
        <div className="space-y-2">
          {uiItems.length > 0 ? (
            uiItems.map((item, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-muted-foreground italic">
              No UI activity yet
            </p>
          )}
        </div>
      </div>

      {/* BI Section */}
      <div className="pt-2 border-t border-muted">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold uppercase text-amber-600">
            BI Messages (Business-Initiated)
          </span>
          <span className="text-xs font-bold">{bi.total ?? 0}</span>
        </div>
        <div className="space-y-2">
          {biItems.length > 0 ? (
            biItems.map((item, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-muted-foreground italic">
              No BI campaigns yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreditsOverview({ data, dashboardData, loading }) {
  const { data: session } = useSession();

  if (loading || !dashboardData) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted/20" />
        ))}
      </div>
    );
  }

  // Normalize possible nested API shapes. Some responses wrap analytics under
  // `data.overview.data` while others provide top-level fields. Prefer the
  // deeply nested shape when present.
  const normalized =
    dashboardData?.data?.overview?.data ||
    dashboardData?.overview?.data ||
    dashboardData?.data?.overview ||
    dashboardData?.overview ||
    dashboardData?.data ||
    dashboardData ||
    {};

  const {
    overview = {},
    couponStats = { byStatus: {} },
    feedbackStats = {},
    whatsappStats = {},
    luckyDrawStats = {},
    customerStats = {},
  } = normalized;

  const user = session?.user;
  const sessionType =
    user?.subscriptionType?.toString?.().toLowerCase() || "temporary";
  const isTemporary = sessionType !== "annual";

  const metrics = [
    {
      label: "Total Coupons",
      value: overview.totalCoupons ?? 0,
      icon: Layers,
      color: "text-blue-600",
      iconBg: "bg-blue-100/50",
    },
    {
      label: "Issued",
      value: overview.totalCouponsIssued ?? 0,
      icon: Ticket,
      color: "text-amber-600",
      iconBg: "bg-amber-100/50",
    },
    {
      label: "Redeemed",
      value: overview.totalCouponsRedeemed ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      iconBg: "bg-green-100/50",
    },
    {
      label: "Messages Sent",
      value:
        whatsappStats.totalMessagesSent ?? overview.whatsappMessagesSent ?? 0,
      icon: MessageCircle,
      color: "text-purple-600",
      iconBg: "bg-purple-100/50",
    },
    {
      label: "Credits Used",
      value: whatsappStats.creditsUsed ?? 0,
      icon: MessageSquare,
      color: "text-violet-600",
      iconBg: "bg-violet-100/50",
    },
    {
      label: "Total Customers",
      value: overview.totalCustomers ?? 0,
      icon: Users,
      color: "text-orange-600",
      iconBg: "bg-orange-100/50",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Top Level Metrics */}
      <div className="grid gap-4 grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </p>
                    <h3 className="text-2xl font-extrabold mt-1 text-gray-900">
                      {(item.value ?? 0).toLocaleString()}
                    </h3>
                    {item.footer && (
                      <p className="text-[9px] mt-1 font-medium text-muted-foreground italic">
                        {item.footer}
                      </p>
                    )}
                  </div>
                  <div className={cn("p-2 rounded-full", item.iconBg)}>
                    <Icon className={cn("w-5 h-5", item.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Coupon Status Chart */}
        <Card className="xl:col-span-1 overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="text-lg">Coupon Status</CardTitle>
            <CardDescription>Redemption Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <CouponPieChart couponStats={couponStats} />
          </CardContent>
        </Card>

        {/* WhatsApp Breakdown */}
        <Card className="xl:col-span-1 overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">WhatsApp</CardTitle>
                <CardDescription>UI & BI Breakdown</CardDescription>
              </div>
              <MessageCircle className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">
              {whatsappStats.totalMessagesSent ?? 0}
            </div>
            <WhatsAppBreakdown stats={whatsappStats} />
          </CardContent>
        </Card>

        {/* Feedback Breakdown */}
        <Card className="xl:col-span-1 overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Feedbacks</CardTitle>
                <CardDescription>Platform Distribution</CardDescription>
              </div>
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">
              {overview.totalFeedbacks ?? 0}
            </div>
            <FeedbackBreakdown stats={feedbackStats} />
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="xl:col-span-1 overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Top Customers</CardTitle>
                <CardDescription>Most active users</CardDescription>
              </div>
              <Users className="w-5 h-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <TopCustomersList customers={customerStats.topCustomers} />
          </CardContent>
        </Card>

        {/* Lucky Draw & Returning */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="xl:col-span-1 overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-500" /> Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customerStats.returningCustomersThisMonth ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">
                Returning this month
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl shadow-lg bg-white border-none transition-all hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.luckyDrawParticipation ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">
                Lucky Draw Spins
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
