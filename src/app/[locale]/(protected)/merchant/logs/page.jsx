"use client";

import SystemLogsContainer from "@/containers/logs/system-logs";
import { useSession } from "next-auth/react";

export default function MerchantLogsPage() {
    const { data: session } = useSession();
    const merchantId = session?.user?.merchantId;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Store Logs</h1>
                <p className="text-muted-foreground">
                    Track your store's operations, coupon usage, and customer interactions.
                </p>
            </div>
            <SystemLogsContainer scope="merchant" merchantId={merchantId} />
        </div>
    );
}
