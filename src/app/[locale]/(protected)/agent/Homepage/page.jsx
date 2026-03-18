"use client";

import { useTranslations } from "next-intl";
import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import AgentLandingPageForm from "@/containers/agent/landing-page-form";

export default function AgentHomepage() {
  const t = useTranslations("agentHomepage.breadcrumb");

  const breadcrumbData = [
    { name: t("dashboard"), url: "/agent/dashboard" },
    { name: "Landing Page Editor", url: "/agent/homepage" },
  ];

  return (
    <>
      <BreadcrumbComponent data={breadcrumbData} />
      <AgentLandingPageForm />
    </>
  );
}
