"use client";

import { BarChart3, Timer, Info, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const format = (num) => (typeof num === "number" ? num.toLocaleString() : "--");

export default function WalletSummary({
  balance,
  summary,
  merchantType,
  expiresAt,
  className = "",
}) {
  const usage = summary?.usage || {};
  const stats = [
    {
      label: "Credits used",
      value: format(usage.used),
      icon: BarChart3,
    },
    {
      label: "Credits remaining",
      value: format(balance),
      icon: Shield,
    },
    ...(merchantType === "TEMPORARY"
      ? [
          {
            label: "Expires at",
            value: expiresAt
              ? new Date(expiresAt).toLocaleDateString()
              : "Not provided",
            icon: Timer,
          },
        ]
      : []),
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Usage summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Read-only pricing tiers. Actions require sufficient balance.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-lg border border-muted/50 bg-muted/30 px-3 py-3"
          >
            <stat.icon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
            </div>
          </div>
        ))}
        {merchantType === "ANNUAL" && (
          <div className="flex items-center gap-3 rounded-lg border border-muted/50 bg-muted/30 px-3 py-3">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Tiers visible</div>
              <div className="text-lg font-semibold">
                Marketing • Utility (read-only)
              </div>
            </div>
          </div>
        )}
        {merchantType === "TEMPORARY" && (
          <div className="flex items-center gap-3 rounded-lg border border-muted/50 bg-muted/30 px-3 py-3">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Tier visible</div>
              <div className="text-lg font-semibold">Temporary (read-only)</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
