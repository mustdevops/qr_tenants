"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AgentMerchantsListingContainer() {
    const [searchTerm, setSearchTerm] = useState("");

    // Dummy merchant data
    const merchants = [
        { id: 1, name: "Coffee House", email: "coffee@example.com", status: "active", subscription: "annual", joinDate: "2024-01-15" },
        { id: 2, name: "Pizza Palace", email: "pizza@example.com", status: "active", subscription: "temporary", joinDate: "2024-02-20" },
        { id: 3, name: "Beauty Salon", email: "beauty@example.com", status: "active", subscription: "annual", joinDate: "2024-03-10" },
        { id: 4, name: "Pet Store", email: "pets@example.com", status: "inactive", subscription: "temporary", joinDate: "2024-01-05" },
        { id: 5, name: "Book Shop", email: "books@example.com", status: "active", subscription: "annual", joinDate: "2024-04-18" },
    ];

    const filteredMerchants = merchants.filter(
        (merchant) =>
            merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Merchants Management</h1>
                    <p className="text-muted-foreground">Manage all your merchants here</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Merchant
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Merchants</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search merchants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMerchants.length > 0 ? (
                                filteredMerchants.map((merchant) => (
                                    <TableRow key={merchant.id}>
                                        <TableCell className="font-medium">{merchant.name}</TableCell>
                                        <TableCell>{merchant.email}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={merchant.status} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={merchant.subscription} />
                                        </TableCell>
                                        <TableCell>{merchant.joinDate}</TableCell>
                                        <TableCell>
                                            <Link href={`/en/agent/merchants/${merchant.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No merchants found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
