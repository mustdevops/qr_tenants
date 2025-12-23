import Link from "next/link";
import { Ticket, MessageSquare } from "lucide-react";
import { KpiCard } from "@/components/common/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Container Imports
import MerchantCouponsListingContainer from "@/containers/merchant/coupons/listing";
import MerchantWalletContainer from "@/containers/merchant/wallet";
import MerchantAnalyticsContainer from "@/containers/merchant/analytics";

export const getDashboardTabs = ({
  kpiData,
  recentRedemptions,
  subscriptionType = "temporary",
}) => {
  const isAnnual = subscriptionType === "annual";

  return [
    {
      value: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {kpiData.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Placeholder for future: redemptions/automation */}
          </div>

          {/* Integrated Analytics (annual only) */}
          {isAnnual ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold italic text-gray-700">
                  Analytics Overview
                </h2>
              </div>
              <MerchantAnalyticsContainer embedded={true} />
            </>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">
                  Analytics & exports (Annual only)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Annual merchants get full analytics, exports, and customer
                  data visibility. Temporary merchants have limited dashboards
                  and higher WhatsApp credit costs.
                </p>
                <div className="flex gap-2">
                  <Link href="/en/merchant/coupons/create">
                    <Button size="sm">Create batch</Button>
                  </Link>
                  <Link href="/en/merchant/campaigns">
                    <Button size="sm" variant="outline">
                      Review campaigns
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
    {
      value: "coupons",
      label: "Coupon Batches",
      content: <MerchantCouponsListingContainer embedded={true} />,
    },
    {
      value: "wallet",
      label: "Wallet",
      content: <MerchantWalletContainer embedded={true} />,
    },
    ...(isAnnual
      ? [
          {
            value: "analytics",
            label: "Analytics",
            content: <MerchantAnalyticsContainer embedded={false} />,
          },
        ]
      : []),
    {
      value: "settings",
      label: "Settings",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings content coming soon...
            </p>
          </CardContent>
        </Card>
      ),
    },
  ];
};
