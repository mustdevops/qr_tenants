import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import PackageForm from "@/containers/agent/packages/packages-form";

export default function AgentSupportPage() {
  const breadcrumbData = [
    { name: "Agent Dashboard", url: "/agent/dashboard" },
    { name: "Packages", url: "/agent/packages/create" },
  ];
  return (
    <>
      <BreadcrumbComponent data={breadcrumbData} />
      <PackageForm isEdit={false} />
    </>
  );
}
