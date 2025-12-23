"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/helper/Loader";
import AnnualWalletView from "./parts/annual-wallet-view";
import TemporaryWalletView from "./parts/temporary-wallet-view";

const WALLET_API = "/api/merchant/wallet";
const WALLET_SUMMARY_API = "/api/merchant/wallet/summary";
const VALIDATE_API = "/api/merchant/wallet/validate";

const deriveType = (wallet, sessionType) => {
  const fromApi =
    wallet?.merchantType ||
    wallet?.merchant_type ||
    wallet?.merchant?.merchant_type ||
    wallet?.merchant?.type ||
    wallet?.type;
  const normalized =
    (fromApi || "").toString().trim().toUpperCase() ||
    (sessionType === "annual" ? "ANNUAL" : "TEMPORARY");
  return normalized === "ANNUAL" ? "ANNUAL" : "TEMPORARY";
};

export default function MerchantWalletContainer({ embedded = false }) {
  const { data: session } = useSession();
  const sessionType =
    session?.user?.subscriptionType?.toString().toLowerCase() || "temporary";

  const [wallet, setWallet] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);

  const merchantType = useMemo(
    () => deriveType(wallet, sessionType),
    [wallet, sessionType]
  );

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [wRes, sRes] = await Promise.all([
          fetch(WALLET_API),
          fetch(WALLET_SUMMARY_API),
        ]);
        const wJson = await wRes.json().catch(() => ({}));
        const sJson = await sRes.json().catch(() => ({}));
        if (!mounted) return;
        setWallet(wJson?.data || wJson || {});
        setSummary(sJson?.data || sJson || {});
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError("Unable to load wallet. Please retry.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleValidateBalance = async () => {
    try {
      setValidating(true);
      const res = await fetch(VALIDATE_API, { method: "POST" });
      if (!res.ok) throw new Error("Validation failed");
      const json = await res.json();
      return json;
    } catch (err) {
      setError("Insufficient credits or expired. Please check your wallet.");
      return null;
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive">
        {error}
      </div>
    );
  }

  const sharedProps = {
    wallet,
    summary,
    onValidate: handleValidateBalance,
    validating,
    embedded,
  };

  if (merchantType === "ANNUAL") {
    return <AnnualWalletView {...sharedProps} />;
  }

  return <TemporaryWalletView {...sharedProps} />;
}
