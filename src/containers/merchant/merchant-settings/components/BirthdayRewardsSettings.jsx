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
import { Cake, Save, Loader2, Sparkles } from "lucide-react";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

export default function BirthdayRewardsSettings() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchantId;

  const [state, setState] = useState({
    enabled: false,
    daysBefore: 3,
    daysAfter: 0,
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
  }, [fetchSettings]);

  const handleSave = useCallback(
    async (isGlobal = false) => {
      if (!merchantId) return;
      if (state.enabled && !state.batchId) {
        if (!isGlobal) {
          toast.error("Action Required: Birthday Club", {
            description:
              "Please select a coupon batch to reward your customers on their birthday.",
          });
        }
        return;
      }
      if (!isGlobal) setSaving(true);
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
        if (!isGlobal) {
          toast.success("Birthday Club Updated", {
            description: "Your birthday automation settings have been saved.",
          });
        }
      } catch (error) {
        console.error("Failed to save birthday settings:", error);
        if (!isGlobal) {
          toast.error("Save Failed", {
            description:
              "Could not update birthday settings. Please try again.",
          });
        }
        throw error;
      } finally {
        if (!isGlobal) setSaving(false);
      }
    },
    [merchantId, state],
  );

  useEffect(() => {
    const onSettingsUpdate = (e) => {
      if (e.detail?.birthday_message_enabled !== undefined) {
        setState((p) => ({ ...p, enabled: e.detail.birthday_message_enabled }));
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
          <div className="h-10 w-10 rounded-xl bg-pink-100/50 text-pink-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Cake className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-gray-900 leading-none">
              Birthday Club
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              Automatic birthday treats
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${state.enabled ? "bg-pink-50 text-pink-600 border-pink-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}
          >
            {state.enabled ? "Active" : "Off"}
          </span>
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${state.enabled
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-50 grayscale"
          }`}
      >
        <div className="overflow-hidden">
          <CardContent className="px-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 ml-1">
                  Days Before
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    className="h-9 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-pink-500/50 text-sm transition-all text-center font-medium"
                    value={state.daysBefore}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        daysBefore: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium pointer-events-none">
                    Days
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 ml-1">
                  Days After
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    className="h-9 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-pink-500/50 text-sm transition-all text-center font-medium"
                    value={state.daysAfter}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        daysAfter: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium pointer-events-none">
                    Days
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 ml-1">
                Birthday Reward
              </Label>
              <BatchSelector
                selectedId={state.batchId}
                merchantId={merchantId}
                isOpen={dropdownOpen}
                setIsOpen={setDropdownOpen}
                onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
                placeholder="Select reward..."
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
