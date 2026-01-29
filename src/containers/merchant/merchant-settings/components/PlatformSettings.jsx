import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Share2, Globe, Facebook, Instagram, MessageCircle } from "lucide-react";
import PlatformItem from "./PlatformItem";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";

export default function PlatformSettings() {
    const { data: session } = useSession();
    const merchantId = session?.user?.merchantId;

    const [state, setState] = useState({
        enableGoogle: false,
        enableFacebook: false,
        enableInstagram: false,
        enableRed: false,
        googleReviewLink: "",
        facebookReviewLink: "",
        instagramReviewLink: "",
        redReviewLink: "",
    });

    const fetchSettings = useCallback(async () => {
        if (!merchantId) return;
        try {
            const res = await axiosInstance.get(
                `/merchant-settings/merchant/${merchantId}`,
            );
            const data = res?.data?.data;
            if (data) {
                setState({
                    enableGoogle: data.enable_google_reviews ?? false,
                    enableFacebook: data.enable_facebook_reviews ?? false,
                    enableInstagram: data.enable_instagram_reviews ?? false,
                    enableRed: data.enable_xiaohongshu_reviews ?? false,
                    googleReviewLink: data.google_review_url || "",
                    facebookReviewLink: data.facebook_page_url || "",
                    instagramReviewLink: data.instagram_url || "",
                    redReviewLink: data.xiaohongshu_url || "",
                });
            }
        } catch (error) {
            console.error("Failed to load platform settings:", error);
        }
    }, [merchantId]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = useCallback(async () => {
        if (!merchantId) return;
        try {
            const payload = {
                merchant_id: merchantId,
                enable_google_reviews: state.enableGoogle,
                enable_facebook_reviews: state.enableFacebook,
                enable_instagram_reviews: state.enableInstagram,
                enable_xiaohongshu_reviews: state.enableRed,
                google_review_url: state.enableGoogle ? state.googleReviewLink : null,
                facebook_page_url: state.enableFacebook ? state.facebookReviewLink : null,
                instagram_url: state.enableInstagram ? state.instagramReviewLink : null,
                xiaohongshu_url: state.enableRed ? state.redReviewLink : null,
            };
            await axiosInstance.patch(
                `/merchant-settings/merchant/${merchantId}`,
                payload,
            );
        } catch (error) {
            console.error("Failed to save platform settings:", error);
            throw error;
        }
    }, [merchantId, state]);

    useEffect(() => {
        window.addEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
        return () => window.removeEventListener("SAVE_MERCHANT_SETTINGS", handleSave);
    }, [handleSave]);

    return (
        <Card className="border-muted/40 shadow-sm overflow-hidden bg-linear-to-br from-white to-gray-50/50 transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-6 border-b border-muted/20 bg-blue-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                        <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">Review Platforms</CardTitle>
                        <CardDescription>
                            Connect your social profiles to collect customer feedback
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6">
                <PlatformItem
                    icon={<Globe className="h-4 w-4 text-blue-600" />}
                    label="Google Reviews"
                    enabled={state.enableGoogle}
                    onToggle={(val) => setState((p) => ({ ...p, enableGoogle: val }))}
                    link={state.googleReviewLink}
                    onLinkChange={(e) =>
                        setState((p) => ({ ...p, googleReviewLink: e.target.value }))
                    }
                    placeholder="https://g.page/r/your-id/review"
                />

                <PlatformItem
                    icon={<Facebook className="h-4 w-4 text-blue-700" />}
                    label="Facebook Page"
                    enabled={state.enableFacebook}
                    onToggle={(val) => setState((p) => ({ ...p, enableFacebook: val }))}
                    link={state.facebookReviewLink}
                    onLinkChange={(e) =>
                        setState((p) => ({ ...p, facebookReviewLink: e.target.value }))
                    }
                    placeholder="https://facebook.com/your-business"
                />

                <PlatformItem
                    icon={<Instagram className="h-4 w-4 text-pink-600" />}
                    label="Instagram Profile"
                    enabled={state.enableInstagram}
                    onToggle={(val) => setState((p) => ({ ...p, enableInstagram: val }))}
                    link={state.instagramReviewLink}
                    onLinkChange={(e) =>
                        setState((p) => ({ ...p, instagramReviewLink: e.target.value }))
                    }
                    placeholder="https://instagram.com/your-handle"
                />

                <PlatformItem
                    icon={<MessageCircle className="h-4 w-4 text-red-600" />}
                    label="XiaoHongShu (Red)"
                    enabled={state.enableRed}
                    onToggle={(val) => setState((p) => ({ ...p, enableRed: val }))}
                    link={state.redReviewLink}
                    onLinkChange={(e) =>
                        setState((p) => ({ ...p, redReviewLink: e.target.value }))
                    }
                    placeholder="https://xiaohongshu.com/user/profile/your-id"
                />
            </CardContent>
        </Card>
    );
}
