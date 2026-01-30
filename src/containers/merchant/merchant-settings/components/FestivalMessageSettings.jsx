import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PartyPopper,
  CalendarDays,
  MessageSquareText,
  Ticket,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

export default function FestivalMessageSettings() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchantId;

  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState({
    name: "",
    date: "",
    message: "",
    isActive: true,
    isRecurring: false,
    batchId: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!merchantId) return;
    try {
      const res = await axiosInstance.get(
        `/merchant-settings/merchant/${merchantId}`,
      );
      const data = res?.data?.data;
      if (data) {
        setEnabled(data.festival_campaign_enabled ?? false);

        if (data.festival_campaign_enabled) {
          const festRes = await axiosInstance.get("/festival-messages", {
            params: { merchant_id: merchantId },
          });
          const festData = festRes?.data?.data?.[0] || festRes?.data?.[0];
          if (festData) {
            setState({
              name: festData.festival_name || "",
              date: festData.festival_date
                ? festData.festival_date.split("T")[0]
                : "",
              message: festData.message || "",
              isActive: festData.is_active ?? true,
              isRecurring: festData.is_recurring ?? false,
              batchId: festData.coupon_batch_id || null,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load festival settings:", error);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = useCallback(
    async (isGlobal = false) => {
      if (!merchantId) return;
      if (enabled) {
        if (!state.batchId) {
          if (!isGlobal) {
            toast.error("Action Required: Festival Campaign", {
              description:
                "Please select a special reward for your festival message.",
            });
          }
          return;
        }
        if (!state.name || !state.date || !state.message) {
          if (!isGlobal) {
            toast.error("Incomplete Festival Details", {
              description:
                "Please ensure names, dates, and messages are filled for your campaign.",
            });
          }
          return;
        }
      }

      if (!isGlobal) setSaving(true);
      try {
        // 1. Save toggle
        await axiosInstance.patch(`/merchant-settings/merchant/${merchantId}`, {
          merchant_id: merchantId,
          festival_campaign_enabled: enabled,
        });

        // 2. Save details
        if (enabled) {
          const payload = {
            merchant_id: merchantId,
            festival_name: state.name,
            festival_date: state.date,
            message: state.message,
            is_active: state.isActive,
            is_recurring: state.isRecurring,
            coupon_batch_id: state.batchId,
          };
          await axiosInstance.post("/festival-messages", payload);
        }

        if (!isGlobal) {
          toast.success("Festival Campaign Updated", {
            description: "Your seasonal greetings have been configured.",
          });
        }
      } catch (error) {
        console.error("Failed to save festival settings:", error);
        if (!isGlobal) {
          toast.error("Save Failed", {
            description:
              "Could not update festival settings. Please try again.",
          });
        }
        throw error;
      } finally {
        if (!isGlobal) setSaving(false);
      }
    },
    [merchantId, enabled, state],
  );

  useEffect(() => {
    const onGlobalSave = () => handleSave(true);
    window.addEventListener("SAVE_MERCHANT_SETTINGS", onGlobalSave);
    return () =>
      window.removeEventListener("SAVE_MERCHANT_SETTINGS", onGlobalSave);
  }, [handleSave]);

  useEffect(() => {
    const onSettingsUpdate = (e) => {
      if (e.detail?.festival_campaign_enabled !== undefined) {
        setEnabled(e.detail.festival_campaign_enabled);
      }
    };
    window.addEventListener("MERCHANT_SETTINGS_UPDATED", onSettingsUpdate);
    return () =>
      window.removeEventListener("MERCHANT_SETTINGS_UPDATED", onSettingsUpdate);
  }, []);

  return (
    <Card className="border-border/40 shadow-sm transition-all duration-300 hover:shadow-md bg-white rounded-2xl overflow-hidden group">
      <div className="p-4 flex items-center justify-between border-b border-border/40 bg-linear-to-b from-gray-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-100/50 text-purple-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <PartyPopper className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-gray-900 leading-none">
              Festival Message
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              Seasonal greetings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${enabled ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}
          >
            {enabled ? "Active" : "Off"}
          </span>
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${enabled
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-50 grayscale"
          }`}
      >
        <div className="overflow-hidden">
          <CardContent className="px-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 ml-1">
                Festival Name
              </Label>
              <Input
                placeholder="Ex: Eid, Christmas"
                value={state.name}
                onChange={(e) =>
                  setState((p) => ({ ...p, name: e.target.value }))
                }
                className="h-9 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-500/50 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 ml-1">
                  Date
                </Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={state.date}
                    onChange={(e) =>
                      setState((p) => ({ ...p, date: e.target.value }))
                    }
                    className="h-9 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-500/50 text-[11px] px-2 font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center h-9 mt-auto">
                <div className="flex items-center space-x-2 bg-gray-50/80 px-3 py-1.5 rounded-lg border border-gray-100 w-full hover:bg-white transition-colors">
                  <Checkbox
                    id="fest_recurring"
                    checked={state.isRecurring}
                    onCheckedChange={(c) =>
                      setState((p) => ({ ...p, isRecurring: c }))
                    }
                    className="data-[state=checked]:bg-purple-600 border-gray-300 h-3.5 w-3.5"
                  />
                  <Label
                    htmlFor="fest_recurring"
                    className="text-[11px] font-medium text-gray-600 cursor-pointer"
                  >
                    Repeat Annual
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 ml-1">
                Message
              </Label>
              <Textarea
                placeholder="Enter greeting..."
                value={state.message}
                onChange={(e) =>
                  setState((p) => ({ ...p, message: e.target.value }))
                }
                className="min-h-20 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-500/50 text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 ml-1">
                Festival Reward
              </Label>
              <BatchSelector
                selectedId={state.batchId}
                merchantId={merchantId}
                isOpen={dropdownOpen}
                setIsOpen={setDropdownOpen}
                onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
                placeholder="Select festival reward..."
                className="h-9 text-sm"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => handleSave(false)}
                disabled={saving}
                size="sm"
                className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow-blue-200 transition-all h-8 px-4 text-xs font-semibold rounded-lg w-full"
              >
                {saving ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                ) : (
                  <Save className="h-3 w-3 mr-2" />
                )}
                Save Settings
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
