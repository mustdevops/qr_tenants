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
import {
  RotateCw,
  Calendar,
  Save,
  Loader2,
  Sparkles,
  Gift,
} from "lucide-react";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

export default function InactiveRecallSettings() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchantId;

  const [state, setState] = useState({
    enabled: false,
    days: 30,
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
          enabled: data.inactive_recall_enabled ?? false,
          days: data.inactive_recall_days ?? 30,
          batchId: data.inactive_recall_coupon_batch_id || null,
        });
      }
    } catch (error) {
      console.error("Failed to load inactive recall settings:", error);
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
          toast.error("Action Required: Inactive Recall", {
            description:
              "Please select an incentive coupon to win back inactive customers.",
          });
        }
        return;
      }
      if (!isGlobal) setSaving(true);
      try {
        const payload = {
          merchant_id: merchantId,
          inactive_recall_enabled: state.enabled,
          inactive_recall_days: Number(state.days),
          inactive_recall_coupon_batch_id: state.enabled ? state.batchId : null,
        };
        await axiosInstance.patch(
          `/merchant-settings/merchant/${merchantId}`,
          payload,
        );
        if (!isGlobal) {
          toast.success("Inactive Recall Updated", {
            description: "Your win-back automation settings have been saved.",
          });
        }
      } catch (error) {
        console.error("Failed to save inactive recall settings:", error);
        if (!isGlobal) {
          toast.error("Save Failed", {
            description: "Could not update recall settings. Please try again.",
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
      if (e.detail?.inactive_recall_enabled !== undefined) {
        setState((p) => ({ ...p, enabled: e.detail.inactive_recall_enabled }));
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
          <div className="h-10 w-10 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <RotateCw className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-gray-900 leading-none">
              Inactive Recall
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              Win back customers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${state.enabled ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}
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
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 ml-1">
                Recall After
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={state.days}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      days: e.target.value,
                    }))
                  }
                  placeholder="30"
                  className="h-9 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500/50 pl-9 font-medium text-sm"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/50" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium pointer-events-none">
                  Days of inactivity
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 ml-1">
                Incentive Reward
              </Label>
              <BatchSelector
                selectedId={state.batchId}
                merchantId={merchantId}
                isOpen={dropdownOpen}
                setIsOpen={setDropdownOpen}
                onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
                placeholder="Choose recall reward..."
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
