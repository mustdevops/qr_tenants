"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PageTabs({ tabs, defaultTab }) {
    return (
        <Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
            <TabsList className="mb-6 h-11 items-center justify-start rounded-lg bg-muted/50 p-1 w-fit border border-border/50">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="h-9 px-5 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}
