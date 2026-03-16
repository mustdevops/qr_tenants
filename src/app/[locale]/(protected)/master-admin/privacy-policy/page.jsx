import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import LegalPageManager from "@/containers/master-admin/legal-pages/legal-page-manager";

export default function PrivacyPolicyManagementPage() {
  const breadcrumbData = [
    { name: "Master Admin Dashboard", url: "/master-admin/dashboard" },
    { name: "Privacy Policy", url: "/master-admin/privacy-policy" },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbComponent data={breadcrumbData} />
      <LegalPageManager
        type="privacy-policy"
        heading="Privacy Policy"
        subtitle="Create, update, publish, and remove your public privacy policy content."
      />
    </div>
  );
}
