"use client";

import { AlertTriangle, Clock3 } from "lucide-react";

const daysUntil = (date) => {
  if (!date) return null;
  const target = new Date(date).getTime();
  const now = Date.now();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function WalletWarnings({
  isLowBalance,
  expiresAt,
  merchantType,
}) {
  const days = daysUntil(expiresAt);
  const isExpiringSoon = typeof days === "number" && days <= 7 && days >= 0;

  if (!isLowBalance && !isExpiringSoon) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4" />
        <span>Wallet warning</span>
      </div>
      <ul className="mt-2 space-y-1 list-disc list-inside">
        {isLowBalance && (
          <li>
            Credits are low. Actions may be blocked after validation (especially
            for temporary merchants).
          </li>
        )}
        {isExpiringSoon && merchantType === "TEMPORARY" && (
          <li className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            Expires in {days} day{days === 1 ? "" : "s"} — plan usage before
            expiry.
          </li>
        )}
      </ul>
    </div>
  );
}
