import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import LegalPageManager from "@/containers/master-admin/legal-pages/legal-page-manager";

export default function TermsAndConditionsManagementPage() {
  const breadcrumbData = [
    { name: "Master Admin Dashboard", url: "/master-admin/dashboard" },
    { name: "Terms and Conditions", url: "/master-admin/terms-and-conditions" },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbComponent data={breadcrumbData} />
      <LegalPageManager
        type="terms-and-conditions"
        heading="Terms and Conditions"
        subtitle="Manage your public terms and conditions with full rich-text control."
      />
    </div>
  );
}
