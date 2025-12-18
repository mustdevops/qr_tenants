"use client";

// Logic moved to src/containers/merchant/wallet/index.jsx
import MerchantWalletContainer from "@/containers/merchant/wallet";

export default function MerchantWalletPage({ embedded = false }) {
    return <MerchantWalletContainer embedded={embedded} />;
}
