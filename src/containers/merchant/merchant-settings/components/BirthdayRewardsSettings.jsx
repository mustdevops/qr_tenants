import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Cake } from "lucide-react";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function BirthdayRewardsSettings() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchantId;

  const [state, setState] = useState({
    enabled: false,
    daysBefore: 3,
    daysAfter: 0,
    batchId: null,
  });
  const [couponBatches, setCouponBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        setState({
          enabled: data.birthday_message_enabled ?? false,
          daysBefore: data.days_before_birthday ?? 3,
          daysAfter: data.days_after_birthday ?? 0,
          batchId: data.birthday_coupon_batch_id || null,
        });
      }
    } catch (error) {
      console.error("Failed to load birthday settings:", error);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchSettings();
    fetchCouponBatches();
  }, [fetchSettings, fetchCouponBatches]);

  const handleSave = useCallback(async () => {
    if (!merchantId) return;
    if (state.enabled && !state.batchId) {
      toast.error("Action Required: Birthday Club", {
        description: "Please select a coupon batch to reward your customers on their birthday.",
      });
      return;
    }
    try {
      const payload = {
        merchant_id: merchantId,
        birthday_message_enabled: state.enabled,
        days_before_birthday: Number(state.daysBefore),
        days_after_birthday: Number(state.daysAfter),
        birthday_coupon_batch_id: state.enabled ? state.batchId : null,
      };
      await axiosInstance.patch(
        `/merchant-settings/merchant/${merchantId}`,
        payload,
      );
    } catch (error) {
      console.error("Failed to save birthday settings:", error);
      throw error;
    }
  }, [merchantId, state]);

  useEffect(() => {
    window.addEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
    return () => window.removeEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
  }, [handleSave]);

  return (
    <Card className={`border-muted/40 shadow-sm overflow-visible transition-all duration-300 hover:shadow-md bg-linear-to-br from-white to-gray-50/30 flex flex-col h-full ${dropdownOpen ? "z-50" : "z-10"}`}>
      <CardHeader className="pb-6 border-b border-muted/20 bg-linear-to-r from-pink-50/50 to-transparent rounded-t-2xl overflow-hidden relative">


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
              <Cake className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Birthday Club</CardTitle>
              <CardDescription>Automated birthday surprises</CardDescription>
            </div>
          </div>
          <Switch
            checked={state.enabled}
            onCheckedChange={(c) => setState((p) => ({ ...p, enabled: c }))}
            className="data-[state=checked]:bg-pink-600"
          />
        </div>
      </CardHeader>
      <CardContent
        className={`p-6 flex-1 flex flex-col space-y-6 transition-all duration-500 ${!state.enabled ? "opacity-40 grayscale pointer-events-none" : "opacity-100"
          }`}
      >
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Days Before
              </Label>
              <Input
                type="number"
                min="0"
                className="bg-muted/30 focus-visible:ring-pink-500"
                value={state.daysBefore}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    daysBefore: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Days After
              </Label>
              <Input
                type="number"
                min="0"
                className="bg-muted/30 focus-visible:ring-pink-500"
                value={state.daysAfter}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    daysAfter: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Birthday Coupon Batch
            </Label>
            <BatchSelector
              selectedId={state.batchId}
              batches={couponBatches}
              isOpen={dropdownOpen}
              setIsOpen={setDropdownOpen}
              onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
              loading={loadingBatches}
              placeholder="Select birthday treat..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
