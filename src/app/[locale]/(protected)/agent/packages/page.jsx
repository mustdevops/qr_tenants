import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import PackagesTable from "@/containers/agent/packages/packages-table";

export default function Packages() {
  const breadcrumbData = [
    { name: "Agent Dashboard", url: "/agent/dashboard" },
    { name: "Packages", url: "/agent/packages" },
  ];
  return (
    <>
      <BreadcrumbComponent data={breadcrumbData} />
      <PackagesTable />
    </>
  );
}
