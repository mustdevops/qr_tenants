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
import { Checkbox } from "@/components/ui/checkbox";
import { PartyPopper, CalendarDays, MessageSquareText } from "lucide-react";
import BatchSelector from "./BatchSelector";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

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
                setEnabled(data.festival_campaign_enabled ?? false);

                if (data.festival_campaign_enabled) {
                    const festRes = await axiosInstance.get("/festival-messages", {
                        params: { merchant_id: merchantId },
                    });
                    const festData = festRes?.data?.data?.[0] || festRes?.data?.[0];
                    if (festData) {
                        setState({
                            name: festData.festival_name || "",
                            date: festData.festival_date ? festData.festival_date.split("T")[0] : "",
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
        fetchCouponBatches();
    }, [fetchSettings, fetchCouponBatches]);

    const handleSave = useCallback(async () => {
        if (!merchantId) return;
        if (enabled) {
            if (!state.batchId) {
                toast.error("Action Required: Festival Campaign", {
                    description: "Please select a special reward for your festival message.",
                });
                return;
            }
            if (!state.name || !state.date || !state.message) {
                toast.error("Incomplete Festival Details", {
                    description: "Please ensure names, dates, and messages are filled for your campaign.",
                });
                return;
            }
        }

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
        } catch (error) {
            console.error("Failed to save festival settings:", error);
            throw error;
        }
    }, [merchantId, enabled, state]);

    useEffect(() => {
        window.addEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
        return () => window.removeEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
    }, [handleSave]);

    return (
        <Card className={`border-muted/40 shadow-sm overflow-visible transition-all duration-300 hover:shadow-md bg-linear-to-br from-white to-gray-50/30 flex flex-col h-full ${dropdownOpen ? "z-50" : "z-10"}`}>
            <CardHeader className="pb-6 border-b border-muted/20 bg-purple-50/20 rounded-t-2xl overflow-hidden relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                            <PartyPopper className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">Festival Campaigns</CardTitle>
                            <CardDescription>Targeted seasonal greetings</CardDescription>
                        </div>
                    </div>
                    <Switch
                        checked={enabled}
                        onCheckedChange={setEnabled}
                        className="data-[state=checked]:bg-purple-600 shadow-xs"
                    />
                </div>
            </CardHeader>
            <CardContent
                className={`p-6 flex-1 flex flex-col space-y-6 transition-all duration-500 ${!enabled ? "opacity-30 grayscale pointer-events-none scale-[0.98]" : "opacity-100 scale-100"
                    }`}
            >
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Festival Name</Label>
                            <Input
                                placeholder="e.g. Eid Mubarak, Chinese New Year"
                                value={state.name}
                                onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))}
                                className="focus-visible:ring-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-purple-500" />
                                    Festival Date
                                </Label>
                                <Input
                                    type="date"
                                    value={state.date}
                                    onChange={(e) => setState((p) => ({ ...p, date: e.target.value }))}
                                    className="focus-visible:ring-purple-500"
                                />
                            </div>
                            <div className="flex items-end pb-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="fest_recurring"
                                        checked={state.isRecurring}
                                        onCheckedChange={(c) => setState((p) => ({ ...p, isRecurring: c }))}
                                        className="data-[state=checked]:bg-purple-600 border-purple-600"
                                    />
                                    <Label
                                        htmlFor="fest_recurring"
                                        className="text-xs font-medium cursor-pointer"
                                    >
                                        Repeat every year
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <MessageSquareText className="h-4 w-4 text-purple-500" />
                                Message Content
                            </Label>
                            <Textarea
                                placeholder="Enter your festive message here..."
                                value={state.message}
                                onChange={(e) => setState((p) => ({ ...p, message: e.target.value }))}
                                className="min-h-[100px] focus-visible:ring-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Festival Special Coupon</Label>
                            <BatchSelector
                                selectedId={state.batchId}
                                batches={couponBatches}
                                isOpen={dropdownOpen}
                                setIsOpen={setDropdownOpen}
                                onSelect={(id) => setState((p) => ({ ...p, batchId: id }))}
                                loading={loadingBatches}
                                placeholder="Choose festival reward..."
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
