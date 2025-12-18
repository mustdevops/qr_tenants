"use client";

import { Plus, Eye, BarChart2 } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import TableToolbar from "@/components/common/table-toolbar";
import { useState } from "react";
import Link from "next/link";

export default function MerchantCouponsListingContainer({ embedded = false }) {
    // Dummy coupon batches
    const batches = [
        { id: 1, name: "Summer Special", quantity: 500, used: 125, status: "active", created: "2024-06-01" },
        { id: 2, name: "Welcome Offer", quantity: 1000, used: 856, status: "active", created: "2024-01-15" },
        { id: 3, name: "Flash Sale", quantity: 100, used: 100, status: "exhausted", created: "2024-05-20" },
        { id: 4, name: "Winter Promo", quantity: 300, used: 156, status: "expired", created: "2023-12-01" },
    ];

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const filteredData = batches.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

    const columns = [
        { accessorKey: "name", header: "Batch Name" },
        { accessorKey: "quantity", header: "Quantity" },
        { accessorKey: "used", header: "Used" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusBadge status={row.original.status} />
        },
        { accessorKey: "created", header: "Created Date" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={`/en/merchant/coupons/${row.original.id}`}>
                        <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/en/merchant/analytics?batch=${row.original.id}`}>
                        <Button variant="ghost" size="icon" title="Analytics">
                            <BarChart2 className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {!embedded && (
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Coupon Batches</h1>
                        <p className="text-muted-foreground">Manage your discount coupons</p>
                    </div>
                    <Link href="/en/merchant/coupons/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Batch
                        </Button>
                    </Link>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Batches</CardTitle>
                </CardHeader>
                <CardContent>
                    <TableToolbar
                        placeholder="Search batches..."
                        onSearchChange={setSearch}
                    />
                    <DataTable
                        data={paginatedData}
                        columns={columns}
                        page={page}
                        pageSize={pageSize}
                        total={filteredData.length}
                        setPage={setPage}
                        setPageSize={setPageSize}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
