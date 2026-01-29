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
import { Switch } from "@/components/ui/switch";
import { RotateCw, Calendar } from "lucide-react";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function InactiveRecallSettings() {
    const { data: session } = useSession();
    const merchantId = session?.user?.merchantId;

    const [state, setState] = useState({
        enabled: false,
        days: 30,
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
        fetchCouponBatches();
    }, [fetchSettings, fetchCouponBatches]);

    const handleSave = useCallback(async () => {
        if (!merchantId) return;
        if (state.enabled && !state.batchId) {
            toast.error("Action Required: Inactive Recall", {
                description: "Please select an incentive coupon to win back inactive customers.",
            });
            return;
        }
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
        } catch (error) {
            console.error("Failed to save inactive recall settings:", error);
            throw error;
        }
    }, [merchantId, state]);

    useEffect(() => {
        window.addEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
        return () => window.removeEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
    }, [handleSave]);

    return (
        <Card className={`border-muted/40 shadow-sm overflow-visible transition-all duration-300 hover:shadow-md bg-linear-to-br from-white to-gray-50/30 flex flex-col h-full ${dropdownOpen ? "z-50" : "z-10"}`}>
            <CardHeader className="pb-6 border-b border-muted/20 bg-blue-50/20 rounded-t-2xl overflow-hidden relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                            <RotateCw className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">Inactive Recall</CardTitle>
                            <CardDescription>Automatically win back customers</CardDescription>
                        </div>
                    </div>
                    <Switch
                        checked={state.enabled}
                        onCheckedChange={(c) => setState((p) => ({ ...p, enabled: c }))}
                        className="data-[state=checked]:bg-blue-600 shadow-xs"
                    />
                </div>
            </CardHeader>
            <CardContent
                className={`p-6 flex-1 flex flex-col space-y-6 transition-all duration-500 ${!state.enabled
                    ? "opacity-30 grayscale pointer-events-none scale-[0.98]"
                    : "opacity-100 scale-100"
                    }`}
            >
                <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                Recall after (days)
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
                                    className="pl-4 pr-12 focus-visible:ring-blue-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                                    Days
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Customers will receive a message if they don&apos;t visit for this
                                many days.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <div className="p-1 bg-blue-100 rounded text-blue-700">
                                    <RotateCw className="h-3 w-3" />
                                </div>
                                Recall Incentive Coupon
                            </Label>
                            <BatchSelector
                                selectedId={state.batchId}
                                batches={couponBatches}
                                isOpen={dropdownOpen}
                                setIsOpen={setDropdownOpen}
                                onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
                                loading={loadingBatches}
                                placeholder="Choose recall reward..."
                            />
                            <p className="text-[11px] text-muted-foreground italic">
                                A compelling offer increases the chance of customer return.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
