import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarClock, Megaphone, Users, Ticket } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function ScheduledCampaignSettings() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchantId;

  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState({
    name: "",
    message: "",
    date: "",
    audience: "all",
    sendCoupons: true,
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
        setEnabled(data.scheduled_campaign_enabled ?? false);

        if (data.scheduled_campaign_enabled) {
          const schedRes = await axiosInstance.get("/scheduled-campaigns", {
            params: { merchant_id: merchantId },
          });
          const schedData = schedRes?.data?.data?.[0] || schedRes?.data?.[0];
          if (schedData) {
            setState({
              name: schedData.campaign_name || "",
              message: schedData.campaign_message || "",
              date: schedData.scheduled_date
                ? new Date(schedData.scheduled_date).toISOString().slice(0, 16)
                : "",
              audience: schedData.target_audience || "all",
              sendCoupons: schedData.send_coupons ?? true,
              batchId: schedData.coupon_batch_id || null,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load scheduled campaign settings:", error);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchSettings();
    fetchCouponBatches();
  }, [fetchSettings, fetchCouponBatches]);

  const handleSave = useCallback(async () => {
    if (!merchantId) return;
    if (enabled) {
      if (state.sendCoupons && !state.batchId) {
        toast.error("Action Required: Scheduled Campaign", {
          description: "Please select a coupon batch to include in your blast.",
        });
        return;
      }
      if (!state.name || !state.message || !state.date) {
        toast.error("Incomplete Campaign Details", {
          description:
            "Please provide a name, message, and date for your broadcast.",
        });
        return;
      }
    }

    try {
      // 1. Save toggle
      await axiosInstance.patch(`/merchant-settings/merchant/${merchantId}`, {
        merchant_id: merchantId,
        // scheduled_campaign_enabled: enabled,
      });

      // 2. Save details
      if (enabled) {
        const payload = {
          merchant_id: merchantId,
          campaign_name: state.name,
          campaign_message: state.message,
          scheduled_date: new Date(state.date).toISOString(),
          target_audience: state.audience,
          send_coupons: state.sendCoupons,
          coupon_batch_id: state.sendCoupons ? state.batchId : null,
        };
        await axiosInstance.post("/scheduled-campaigns", payload);
      }
    } catch (error) {
      console.error("Failed to save scheduled campaign settings:", error);
      throw error;
    }
  }, [merchantId, enabled, state]);

  useEffect(() => {
    window.addEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
    return () =>
      window.removeEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
  }, [handleSave]);

  return (
    <Card
      className={`border-muted/40 shadow-sm overflow-visible transition-all duration-300 hover:shadow-md bg-linear-to-br from-white to-gray-50/30 flex flex-col h-full ${dropdownOpen ? "z-50" : "z-10"}`}
    >
      <CardHeader className="pb-6 border-b border-muted/20 bg-orange-50/30 rounded-t-2xl overflow-hidden relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Scheduled Campaigns
              </CardTitle>
              <CardDescription>Plan future marketing blasts</CardDescription>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            className="data-[state=checked]:bg-orange-600 shadow-xs"
          />
        </div>
      </CardHeader>
      <CardContent
        className={`p-6 flex-1 flex flex-col space-y-6 transition-all duration-500 ${
          !enabled
            ? "opacity-30 grayscale pointer-events-none scale-[0.98]"
            : "opacity-100 scale-100"
        }`}
      >
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Campaign Name</Label>
              <Input
                placeholder="e.g. Grand Opening Special"
                value={state.name}
                onChange={(e) =>
                  setState((p) => ({ ...p, name: e.target.value }))
                }
                className="focus-visible:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-orange-500" />
                  Date & Time
                </Label>
                <Input
                  type="datetime-local"
                  value={state.date}
                  onChange={(e) =>
                    setState((p) => ({ ...p, date: e.target.value }))
                  }
                  className="focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Target Audience
                </Label>
                <Select
                  value={state.audience}
                  onValueChange={(val) =>
                    setState((p) => ({ ...p, audience: val }))
                  }
                >
                  <SelectTrigger className="focus:ring-orange-500">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active (30 days)</SelectItem>
                    <SelectItem value="inactive">
                      Inactive (90+ days)
                    </SelectItem>
                    <SelectItem value="first_time">
                      First-time Visitors
                    </SelectItem>
                    <SelectItem value="returning">
                      Returning Customers
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Message Content</Label>
              <Textarea
                placeholder="Hi {customer_name}, we're excited..."
                value={state.message}
                onChange={(e) =>
                  setState((p) => ({ ...p, message: e.target.value }))
                }
                className="min-h-[100px] focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-orange-500" />
                  Include Coupons
                </Label>
                <Switch
                  checked={state.sendCoupons}
                  onCheckedChange={(c) =>
                    setState((p) => ({ ...p, sendCoupons: c }))
                  }
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>

              {state.sendCoupons && (
                <div className="animate-in slide-in-from-top-2">
                  <BatchSelector
                    selectedId={state.batchId}
                    batches={couponBatches}
                    isOpen={dropdownOpen}
                    setIsOpen={setDropdownOpen}
                    onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
                    loading={loadingBatches}
                    placeholder="Choose campaign reward..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
