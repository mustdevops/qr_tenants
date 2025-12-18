"use client";

import { ArrowLeft, Mail, Phone, Calendar, CreditCard } from "lucide-react";
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
import Link from "next/link";
import { use } from "react";

export default function AgentMerchantDetailContainer({ params }) {
    const { id } = use(params);

    // Dummy merchant data
    const merchant = {
        id,
        name: "Coffee House",
        email: "coffee@example.com",
        phone: "+1 234 567 8900",
        status: "active",
        subscription: "annual",
        joinDate: "2024-01-15",
        address: "123 Main St, New York, NY 10001",
        credits: 2500,
    };

    // Dummy transaction history
    const transactions = [
        { id: 1, date: "2024-06-01", description: "Credit purchase", amount: 500, type: "credit", status: "paid" },
        { id: 2, date: "2024-05-28", description: "WhatsApp campaign", amount: -50, type: "debit", status: "completed" },
        { id: 3, date: "2024-05-25", description: "Coupon batch created", amount: -100, type: "debit", status: "completed" },
        { id: 4, date: "2024-05-20", description: "Credit purchase", amount: 1000, type: "credit", status: "paid" },
    ];

    const activityLog = [
        { id: 1, date: "2024-06-02", action: "Logged in", details: "User logged in from Chrome" },
        { id: 2, date: "2024-06-01", action: "Coupon created", details: "Created new coupon batch 'Summer Special'" },
        { id: 3, date: "2024-05-30", action: "Settings updated", details: "Updated WhatsApp automation settings" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/en/agent/merchants">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{merchant.name}</h1>
                    <p className="text-muted-foreground">Merchant Details</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{merchant.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{merchant.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Join Date</p>
                                <p className="font-medium">{merchant.joinDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4" />
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="font-medium">{merchant.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <div className="mt-1">
                                <StatusBadge status={merchant.status} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Subscription Type</p>
                            <div className="mt-1">
                                <StatusBadge status={merchant.subscription} />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Available Credits</p>
                                <p className="text-2xl font-bold">{merchant.credits.toLocaleString()}</p>
                            </div>
                        </div>
                        <Button className="w-full">Edit Merchant</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                        {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={transaction.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activityLog.map((log) => (
                            <div key={log.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                                <div>
                                    <p className="font-medium">{log.action}</p>
                                    <p className="text-sm text-muted-foreground">{log.details}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">{log.date}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
