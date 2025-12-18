"use client";

// Logic moved to src/containers/merchant/analytics/index.jsx
import MerchantAnalyticsContainer from "@/containers/merchant/analytics";

export default function MerchantAnalyticsPage({ embedded = false }) {
    return <MerchantAnalyticsContainer embedded={embedded} />;
}
