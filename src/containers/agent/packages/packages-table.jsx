"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TableToolbar from "@/components/common/table-toolbar";
import { DataTable } from "@/components/common/data-table";
import { PackagesColumns } from "./packages-columns";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function PackagesTable() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  // Fetch packages from API
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/wallets/credit-packages", {
        params: {
          admin_id: session.user.adminId,
        },
      });

      // Handle different response structures
      const data = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      setPackages(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Filter packages by name or credit type
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.credit_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (pkg) => {
    router.push(`/agent/packages/edit/${pkg.id}`);
  };

  const handleDelete = (pkg) => {
    console.log("Deleting package:", pkg.id);
  };

  // Pagination
  const paginatedData = filteredPackages.slice(
    page * pageSize,
    (page + 1) * pageSize
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Packages</h1>
          <p className="text-muted-foreground">Manage your credit packages</p>
        </div>
      </div>

      {/* Filter/Search */}

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>

        <CardContent>
          <TableToolbar
            placeholder="Search packages by name or type..."
            search={search}
            onSearchChange={setSearch}
            total={filteredPackages.length}
            rightSlot={
              <Button onClick={() => router.push("/agent/packages/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Package
              </Button>
            }
          />
          <DataTable
            data={paginatedData}
            columns={PackagesColumns({
              onEdit: handleEdit,
              onDelete: handleDelete,
            })}
            page={page}
            pageSize={pageSize}
            total={filteredPackages.length}
            setPage={setPage}
            setPageSize={setPageSize}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
