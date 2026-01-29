import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Save, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function PresetReviewsSettings() {
    const { data: session } = useSession();
    const merchantId = session?.user?.merchantId;

    const [presets, setPresets] = useState(Array(10).fill(""));
    const [enablePresetReviews, setEnablePresetReviews] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSettings = useCallback(async () => {
        if (!merchantId) return;
        try {
            // Fetch the enabled flag
            const settingsRes = await axiosInstance.get(
                `/merchant-settings/merchant/${merchantId}`,
            );
            setEnablePresetReviews(settingsRes?.data?.data?.enable_preset_reviews ?? false);

            // Fetch the actual reviews
            const reviewsRes = await axiosInstance.get("/preset-reviews", {
                params: { merchantId },
            });
            const reviews = reviewsRes?.data?.data || [];
            const sorted = reviews
                .filter((r) => r.is_active)
                .sort((a, b) => a.display_order - b.display_order);

            const newPresets = Array(10).fill("");
            sorted.forEach((r, idx) => {
                if (idx < 10) newPresets[idx] = r.review_text;
            });
            setPresets(newPresets);
        } catch (error) {
            console.error("Failed to load preset reviews:", error);
        }
    }, [merchantId]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = useCallback(async () => {
        if (!merchantId) return;
        setLoading(true);
        try {
            // Save the enabled flag
            await axiosInstance.patch(`/merchant-settings/merchant/${merchantId}`, {
                merchant_id: merchantId,
                enable_preset_reviews: enablePresetReviews,
            });

            // Save the presets
            const payload = {
                reviews: enablePresetReviews
                    ? presets
                        .map((text, index) => ({
                            id: index + 1,
                            merchant_id: merchantId,
                            reviewText: text.trim(),
                            isActive: true,
                            displayOrder: index + 1,
                        }))
                        .filter((p) => p.reviewText !== "")
                    : [],
            };
            await axiosInstance.patch("/preset-reviews", payload);
        } catch (error) {
            console.error("Failed to save preset reviews:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [merchantId, enablePresetReviews, presets]);

    useEffect(() => {
        window.addEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
        return () => window.removeEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
    }, [handleSave]);

    const handlePresetChange = (index, value) => {
        const newPresets = [...presets];
        newPresets[index] = value;
        setPresets(newPresets);
    };

    return (
        <Card className="border-muted/40 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-6 border-b border-muted/20 bg-orange-50/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
                            <MessageSquareQuote className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">Quick Review Options</CardTitle>
                            <CardDescription>
                                Pre-written reviews for customers to choose from
                            </CardDescription>
                        </div>
                    </div>
                    <Switch
                        checked={enablePresetReviews}
                        onCheckedChange={setEnablePresetReviews}
                        className="data-[state=checked]:bg-orange-600"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ${!enablePresetReviews
                        ? "opacity-30 grayscale pointer-events-none scale-[0.98]"
                        : "opacity-100 scale-100"
                        }`}
                >
                    {presets.map((preset, idx) => (
                        <div key={idx} className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                                {idx + 1}
                            </div>
                            <Input
                                value={preset}
                                onChange={(e) => handlePresetChange(idx, e.target.value)}
                                className="pl-12 bg-muted/20 border-muted/60 focus:bg-background focus-visible:ring-orange-500 transition-all"
                                placeholder={`Example: "Great service!"`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            try {
                                await handleSave();
                                toast.success("Presets saved successfully");
                            } catch (e) {
                                toast.error("Failed to save presets");
                            }
                        }}
                        disabled={loading || !enablePresetReviews}
                        className="gap-2"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Presets Only
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
