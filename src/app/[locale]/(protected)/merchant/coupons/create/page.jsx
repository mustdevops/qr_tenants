"use client";

// Logic moved to src/containers/merchant/coupons/create/index.jsx
import MerchantCreateCouponContainer from "@/containers/merchant/coupons/create";
import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";

export default function CreateCouponPage() {
    const breadcrumbData = [
        { name: "Merchant Dashboard", url: "/en/merchant/dashboard" },
        { name: "Coupon Batches", url: "/en/merchant/coupons" },
        { name: "Create Batch", url: "/en/merchant/coupons/create" },
    ];

    return (
        <div className="space-y-6">
            <BreadcrumbComponent data={breadcrumbData} />
            <MerchantCreateCouponContainer />
        </div>
    );
}
