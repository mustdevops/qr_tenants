"use client";

// Logic moved to src/containers/merchant/coupons/listing/index.jsx
import MerchantCouponsListingContainer from "@/containers/merchant/coupons/listing";

export default function MerchantCouponsPage({ embedded = false }) {
    return <MerchantCouponsListingContainer embedded={embedded} />;
}
