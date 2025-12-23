"use client";

import { AlertTriangle, Clock3, ShieldOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletSummary from "./wallet-summary";
import WalletWarnings from "./wallet-warnings";

const format = (num) => (typeof num === "number" ? num.toLocaleString() : "--");

export default function TemporaryWalletView({
  wallet,
  summary,
  onValidate,
  validating,
  embedded = false,
}) {
  const balance = wallet?.balance ?? 0;
  const expiresAt = wallet?.expiresAt || summary?.expiresAt;
  const batchUsage = summary?.batches || [];

  const isLow = balance < 100;

  return (
    <div className="space-y-6">
      {!embedded && (
        <header>
          <h1 className="text-3xl font-bold">Wallet & Credits</h1>
          <p className="text-muted-foreground">
            Temporary merchants see temporary tier only. No transactions view.
          </p>
        </header>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-linear-to-br from-amber-100/40 to-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle>Remaining credits</CardTitle>
            <p className="text-sm text-muted-foreground">
              Temporary tier (short-term usage)
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-amber-700">
              {format(balance)}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-amber-300 bg-white px-3 py-1 font-semibold text-amber-700">
                TEMPORARY
              </span>
            </div>
            <Button
              className="w-full"
              variant="outline"
              disabled={validating || balance <= 0}
              onClick={onValidate}
            >
              {validating ? "Validating..." : "Validate before using credits"}
            </Button>
            {balance <= 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-700">
                <ShieldOff className="h-4 w-4" />
                Credits exhausted — actions will be blocked.
              </div>
            )}
          </CardContent>
        </Card>

        <WalletSummary
          balance={balance}
          summary={summary}
          merchantType="TEMPORARY"
          expiresAt={expiresAt}
          className="lg:col-span-2"
        />
      </div>

      <WalletWarnings
        isLowBalance={isLow}
        expiresAt={expiresAt}
        merchantType="TEMPORARY"
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Batch-wise usage</h2>
            <p className="text-sm text-muted-foreground">
              Credits consumed per batch.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {batchUsage.length ? (
            batchUsage.map((batch) => (
              <Card key={batch.id || batch.name}>
                <CardContent className="pt-4 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{batch.name}</span>
                    <span className="text-muted-foreground">
                      TEMPORARY tier
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Used: {format(batch.used)} / {format(batch.total || 0)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    Last activity: {batch.lastUsed || "N/A"}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                No batch usage available yet.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Transaction history and Marketing/Utility tiers are unavailable for
            temporary merchants.
          </span>
        </div>
      </section>
    </div>
  );
}
