"use client";

import { RefreshCw, Play } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AgentCouponSyncContainer() {
    // Dummy sync data
    const syncHistory = [
        { id: 1, merchant: "Coffee House", items: 50, status: "completed", date: "2024-06-02 10:30 AM" },
        { id: 2, merchant: "Pizza Palace", items: 100, status: "in-progress", date: "2024-06-02 11:15 AM" },
        { id: 3, merchant: "Beauty Salon", items: 25, status: "completed", date: "2024-06-01 02:45 PM" },
        { id: 4, merchant: "Pet Store", items: 0, status: "failed", date: "2024-05-31 09:20 AM" },
        { id: 5, merchant: "Book Shop", items: 75, status: "completed", date: "2024-05-30 04:10 PM" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Coupon Sync Management</h1>
                    <p className="text-muted-foreground">Monitor and trigger coupon synchronizations</p>
                </div>
                <Button>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Request New Sync
                </Button>
            </div>

            {/* Pending Syncs */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Synchronizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                                <RefreshCw className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">Pizza Palace</p>
                                <p className="text-sm text-muted-foreground">Syncing 100 serial codes...</p>
                            </div>
                        </div>
                        <StatusBadge status="in-progress" />
                    </div>
                </CardContent>
            </Card>

            {/* Sync History Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Sync History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Merchant</TableHead>
                                <TableHead>Items Synced</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {syncHistory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.merchant}</TableCell>
                                    <TableCell>{item.items} codes</TableCell>
                                    <TableCell>
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        {item.status === "failed" && (
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                                <Play className="h-4 w-4 mr-1" /> Retry
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
