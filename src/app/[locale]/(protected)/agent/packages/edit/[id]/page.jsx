import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import PackageForm from "@/containers/agent/packages/packages-form";

export default function EditPackagePage({ params }) {
  const breadcrumbData = [
    { name: "Agent Dashboard", url: "/agent/dashboard" },
    { name: "Packages", url: "/agent/packages" },
    { name: "Edit Package", url: `/agent/packages/edit/${params.id}` },
  ];

  return (
    <>
      <BreadcrumbComponent data={breadcrumbData} />
      <PackageForm isEdit={true} />
    </>
  );
}
