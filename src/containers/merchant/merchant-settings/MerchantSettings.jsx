"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";
import { useSession } from "next-auth/react";

// Components
import PlatformSettings from "./components/PlatformSettings";
import PresetReviewsSettings from "./components/PresetReviewsSettings";
import RewardStrategySettings from "./components/RewardStrategySettings";
import BirthdayRewardsSettings from "./components/BirthdayRewardsSettings";
import InactiveRecallSettings from "./components/InactiveRecallSettings";
import FestivalMessageSettings from "./components/FestivalMessageSettings";
import ScheduledCampaignSettings from "./components/ScheduledCampaignSettings";
import StickySaveBar from "./components/StickySaveBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Rocket, Zap } from "lucide-react";

export default function MerchantSettings() {
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();

  const subscriptionType =
    session?.user?.subscriptionType?.toString?.().toLowerCase() || "temporary";
  const isAnnual = subscriptionType === "annual";

  const handleSaveAllSettings = async () => {
    setSaving(true);
    try {
      // Dispatch global save event that all independent components listen to
      window.dispatchEvent(new CustomEvent("SAVE_MERCHANT_SETTINGS"));

      setTimeout(() => {
        toast.success("Settings synchronized", {
          description: "All configurations have been successfully updated.",
        });
        setSaving(false);
      }, 1500);
    } catch (error) {
      setSaving(false);
    }
  };

  return (
    <div className="relative space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-muted/20 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary/80">
              Merchant Control Center
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent">
            Review & Reward Strategy
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Optimize how customers interact with your brand. Manage review
            platforms, automated rewards, and seasonal engagement campaigns in
            one place.
          </p>
        </div>
      </div>

      <Tabs defaultValue="core" className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 rounded-xl h-auto border border-muted/20">
            <TabsTrigger
              value="core"
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all flex items-center gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Core Configuration
            </TabsTrigger>
            {isAnnual && (
              <TabsTrigger
                value="automations"
                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all flex items-center gap-2"
              >
                <Rocket className="h-4 w-4" />
                Marketing Automations
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent
          value="core"
          className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7 space-y-8">
              <PlatformSettings />
              <PresetReviewsSettings />
            </div>

            <div className="xl:col-span-5 space-y-0 h-full">
              <RewardStrategySettings />
              <div className="p-8 rounded-3xl bg-gray-900 from-gray-900 to-gray-900 text-white border border-gray-900/20 relative overflow-hidden group shadow-xl">
                <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <Rocket className="h-48 w-48 text-white" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                      <Zap className="h-5 w-5 text-emerald-200 fill-emerald-200" />
                    </div>
                    <h4 className="font-extrabold text-lg tracking-tight uppercase">
                      Strategy Insight
                    </h4>
                  </div>
                  <p className="text-emerald-50/90 text-sm leading-relaxed font-medium">
                    &quot;Combine <strong>Direct Coupons</strong> with{" "}
                    <strong>Preset Reviews</strong> to drastically increase your
                    positive review count while keeping customers happy with
                    instant rewards.&quot;
                  </p>
                  <div className="pt-2">
                    <div className="h-1 w-12 bg-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {isAnnual && (
          <TabsContent
            value="automations"
            className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500 relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative z-20">
              <div className="flex flex-col h-full">
                <BirthdayRewardsSettings />
              </div>
              <div className="flex flex-col h-full">
                <InactiveRecallSettings />
              </div>
              <div className="flex flex-col h-full">
                <FestivalMessageSettings />
              </div>
              <div className="flex flex-col h-full">
                <ScheduledCampaignSettings />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <StickySaveBar loading={saving} onSave={handleSaveAllSettings} />
    </div>
  );
}
