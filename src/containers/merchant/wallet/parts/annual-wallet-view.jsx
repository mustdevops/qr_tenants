"use client";

import { CreditCard, AlertTriangle, Clock3, Check, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/common/transaction-table";
import WalletSummary from "./wallet-summary";
import WalletWarnings from "./wallet-warnings";

const format = (num) => (typeof num === "number" ? num.toLocaleString() : "--");

export default function AnnualWalletView({
  wallet,
  summary,
  onValidate,
  validating,
  embedded = false,
}) {
  const balance = wallet?.balance ?? 0;
  const tiers = wallet?.tiers || ["MARKETING", "UTILITY"];
  const transactions = wallet?.transactions || [];
  const batchUsage = summary?.batches || [];

  const isLow = balance < 200;

  return (
    <div className="space-y-6">
      {!embedded && (
        <header>
          <h1 className="text-3xl font-bold">Wallet & Credits</h1>
          <p className="text-muted-foreground">
            Annual merchants see Marketing + Utility tiers and full history.
          </p>
        </header>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Current Balance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Marketing & Utility credits
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold">{format(balance)}</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {tiers.map((tier) => (
                <span
                  key={tier}
                  className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary"
                >
                  {tier}
                </span>
              ))}
            </div>
            <Button
              className="w-full"
              variant="outline"
              disabled={validating}
              onClick={onValidate}
            >
              {validating ? "Validating..." : "Validate balance before actions"}
            </Button>
          </CardContent>
        </Card>

        <WalletSummary
          balance={balance}
          summary={summary}
          merchantType="ANNUAL"
          className="lg:col-span-2"
        />
      </div>

      <WalletWarnings
        isLowBalance={isLow}
        expiresAt={summary?.expiresAt}
        merchantType="ANNUAL"
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Batch-wise usage</h2>
            <p className="text-sm text-muted-foreground">
              Deduction details per batch.
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
                      {batch.tier || "—"}
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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent transactions</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="h-4 w-4 text-emerald-500" />
            Annual merchants see history by tier.
          </div>
        </div>
        <Card>
          <CardContent className="pt-4">
            {transactions.length ? (
              <TransactionTable transactions={transactions} />
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Minus className="h-4 w-4" />
                No transactions yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
