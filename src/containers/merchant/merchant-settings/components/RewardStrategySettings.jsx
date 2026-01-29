import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Ribbon, Sparkles, Ticket } from "lucide-react";
import Link from "next/link";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function RewardStrategySettings() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchantId;

  const [luckyDrawEnabled, setLuckyDrawEnabled] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [couponBatches, setCouponBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);

  const fetchCouponBatches = useCallback(async () => {
    if (!merchantId) return;
    setLoadingBatches(true);
    try {
      const res = await axiosInstance.get("/coupon-batches", {
        params: { page: 1, pageSize: 50 },
      });
      const data = res?.data?.data || res?.data || {};
      setCouponBatches(data.batches || []);
    } catch (error) {
      console.error("Failed to load coupon batches:", error);
    } finally {
      setLoadingBatches(false);
    }
  }, [merchantId]);

  const fetchSettings = useCallback(async () => {
    if (!merchantId) return;
    try {
      const res = await axiosInstance.get(
        `/merchant-settings/merchant/${merchantId}`,
      );
      const data = res?.data?.data;
      if (data) {
        setLuckyDrawEnabled(data.luckydraw_enabled ?? false);
        setSelectedBatchId(data.whatsapp_enabled_for_batch_id || null);
      }
    } catch (error) {
      console.error("Failed to load reward strategy:", error);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchSettings();
    fetchCouponBatches();
  }, [fetchSettings, fetchCouponBatches]);

  const handleSave = useCallback(async () => {
    if (!merchantId) return;

    if (!luckyDrawEnabled && !selectedBatchId) {
      toast.error("Please select a Coupon Batch for Direct Rewards.");
      return;
    }

    try {
      const payload = {
        merchant_id: merchantId,
        luckydraw_enabled: luckyDrawEnabled,
        whatsapp_enabled_for_batch_id: luckyDrawEnabled
          ? null
          : selectedBatchId,
      };
      await axiosInstance.patch(
        `/merchant-settings/merchant/${merchantId}`,
        payload,
      );
    } catch (error) {
      console.error("Failed to save reward strategy:", error);
      throw error; // Let parent handle aggregation if needed
    }
  }, [merchantId, luckyDrawEnabled, selectedBatchId]);

  useEffect(() => {
    const onSave = async () => {
      try {
        await handleSave();
      } catch (e) {
        // Error toast handled by parent or here
      }
    };
    window.addEventListener("SAVE_MERCHANT_SETTINGS", onSave);
    return () => window.removeEventListener("SAVE_MERCHANT_SETTINGS", onSave);
  }, [handleSave]);

  return (
    <Card
      className={`border-muted/40 shadow-sm overflow-visible transition-all duration-300 hover:shadow-md bg-linear-to-br from-white to-gray-50/30 flex flex-col  ${batchDropdownOpen ? "z-50" : "z-10"}`}
    >
      <CardHeader className="pb-6 border-b border-muted/20 bg-emerald-50/30 relative overflow-hidden rounded-t-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Ribbon className="h-16 w-16 -rotate-12" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl shadow-sm">
            <Ribbon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Reward Strategy</CardTitle>
            <CardDescription className="text-sm">
              Define your primary customer incentive
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col space-y-6">
        <div className="flex-1 space-y-5">
          {/* Lucky Draw Option */}
          <div
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
              luckyDrawEnabled
                ? "border-primary bg-primary/3 shadow-inner"
                : "border-muted hover:border-primary/20 hover:bg-muted/5"
            }`}
            onClick={() => setLuckyDrawEnabled(true)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    luckyDrawEnabled
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "bg-muted text-muted-foreground group-hover:scale-105"
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-base leading-tight">
                    Lucky Draw
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gamified experience to boost engagement
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  luckyDrawEnabled
                    ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                    : "border-muted"
                }`}
              >
                {luckyDrawEnabled && (
                  <div className="w-3 h-3 rounded-full bg-primary animate-in zoom-in duration-300" />
                )}
              </div>
            </div>
            {luckyDrawEnabled && (
              <div className="mt-4 text-[11px] text-orange-700 bg-orange-50/80 px-4 py-2.5 rounded-xl border border-orange-100/50 flex items-start gap-2 shadow-xs animate-in slide-in-from-top-2">
                <span className="mt-0.5">💡</span>
                <span>
                  Configure prizes in the{" "}
                  <Link
                    href="/merchant/lucky-draw"
                    className="font-bold underline underline-offset-4 hover:text-orange-900 transition-colors"
                  >
                    Lucky Draw tab
                  </Link>
                </span>
              </div>
            )}
          </div>

          {/* Direct Coupon Option */}
          <div
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
              !luckyDrawEnabled
                ? "border-primary bg-primary/3 shadow-inner"
                : "border-muted hover:border-primary/20 hover:bg-muted/5"
            }`}
            onClick={() => setLuckyDrawEnabled(false)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    !luckyDrawEnabled
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "bg-muted text-muted-foreground group-hover:scale-105"
                  }`}
                >
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-base leading-tight">
                    Direct Coupon
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Instant gratification via WhatsApp
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  !luckyDrawEnabled
                    ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                    : "border-muted"
                }`}
              >
                {!luckyDrawEnabled && (
                  <div className="w-3 h-3 rounded-full bg-primary animate-in zoom-in duration-300" />
                )}
              </div>
            </div>

            {!luckyDrawEnabled && (
              <div
                className="mt-5 animate-in fade-in slide-in-from-top-3 flex flex-col gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-0.5">
                    Select Reward Batch <span className="text-red-500">*</span>
                  </Label>
                  <BatchSelector
                    selectedId={selectedBatchId}
                    batches={couponBatches}
                    isOpen={batchDropdownOpen}
                    setIsOpen={setBatchDropdownOpen}
                    onSelect={(id) => setSelectedBatchId(id)}
                    loading={loadingBatches}
                    placeholder="Choose regular reward..."
                  />
                </div>
                {!selectedBatchId && (
                  <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[10px] text-red-600 font-bold">
                      Selection required for Direct Coupon strategy
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
