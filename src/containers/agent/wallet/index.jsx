"use client";

import { Wallet, TrendingUp } from "lucide-react";
import { PageTabs } from "@/components/common/page-tabs";
import { TransactionTable } from "@/components/common/transaction-table";
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

export default function AgentWalletContainer() {
    // Dummy balance data
    const currentBalance = 45000;
    const pendingBalance = 3500;

    // Dummy transactions
    const transactions = [
        { id: 1, date: "2024-06-01", description: "Commission from Coffee House", amount: 250, type: "credit", status: "paid" },
        { id: 2, date: "2024-05-28", description: "Commission from Pizza Palace", amount: 180, type: "credit", status: "paid" },
        { id: 3, date: "2024-05-25", description: "Withdrawal to bank", amount: -5000, type: "debit", status: "completed" },
        { id: 4, date: "2024-05-20", description: "Commission from Beauty Salon", amount: 320, type: "credit", status: "paid" },
        { id: 5, date: "2024-05-18", description: "Commission from Pet Store", amount: 150, type: "credit", status: "pending" },
    ];

    // Dummy auto-deductions
    const autoDeductions = [
        { id: 1, date: "2024-06-01", description: "Platform fee", amount: 50, frequency: "Monthly" },
        { id: 2, date: "2024-05-01", description: "Platform fee", amount: 50, frequency: "Monthly" },
        { id: 3, date: "2024-04-01", description: "Platform fee", amount: 50, frequency: "Monthly" },
    ];

    const tabs = [
        {
            value: "balance",
            label: "Balance",
            content: (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">${currentBalance.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-green-500">+12.5%</span>
                                    <span>from last month</span>
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">${pendingBalance.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Awaiting clearance
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal Request</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Request a withdrawal from your available balance to your registered bank account.
                            </p>
                            <Button>Request Withdrawal</Button>
                        </CardContent>
                    </Card>
                </div>
            ),
        },
        {
            value: "transactions",
            label: "Transactions",
            content: (
                <TransactionTable transactions={transactions} title="Transaction History" />
            ),
        },
        {
            value: "auto-deductions",
            label: "Auto-Deductions",
            content: (
                <Card>
                    <CardHeader>
                        <CardTitle>Auto-Deductions Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Frequency</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {autoDeductions.map((deduction) => (
                                    <TableRow key={deduction.id}>
                                        <TableCell>{deduction.date}</TableCell>
                                        <TableCell>{deduction.description}</TableCell>
                                        <TableCell className="text-red-600">-${deduction.amount}</TableCell>
                                        <TableCell>{deduction.frequency}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Agent Wallet</h1>
                <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
            </div>

            <PageTabs tabs={tabs} defaultTab="balance" />
        </div>
    );
}
