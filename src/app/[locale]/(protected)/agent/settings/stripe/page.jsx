import { getTranslations } from "next-intl/server";
import PageContainer from "@/components/layouts/page-container";
import StripeSettingsContainer from "@/containers/agent/settings/stripe-settings-container";

export default async function StripeSettingsPage() {
    const t = await getTranslations("agent.settings");

    return (
        <PageContainer
            breadcrumbs={[
                { name: "Dashboard", url: "/agent/dashboard" },
                { name: "Settings", url: "/agent/settings" },
                { name: "Stripe Settings", url: "/agent/settings/stripe" },
            ]}
        >
            <StripeSettingsContainer />
        </PageContainer>
    );
}
