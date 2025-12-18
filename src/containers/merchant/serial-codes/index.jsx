"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { ExportButton } from "@/components/common/export-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function MerchantSerialCodesContainer() {
    const [searchTerm, setSearchTerm] = useState("");

    // Dummy serial codes data
    const serialCodes = [
        { id: 1, code: "SUM-8X92", batch: "Summer Special", status: "used", customer: "John Doe", date: "2024-06-02" },
        { id: 2, code: "SUM-3A7B", batch: "Summer Special", status: "used", customer: "Jane Smith", date: "2024-06-01" },
        { id: 3, code: "WEL-9Y8Z", batch: "Welcome Offer", status: "unused", customer: "-", date: "-" },
        { id: 4, code: "WEL-4K2L", batch: "Welcome Offer", status: "unused", customer: "-", date: "-" },
        { id: 5, code: "FLA-1M2N", batch: "Flash Sale", status: "used", customer: "Mike Johnson", date: "2024-05-25" },
        { id: 6, code: "FLA-3P4Q", batch: "Flash Sale", status: "used", customer: "Sarah Wilson", date: "2024-05-25" },
    ];

    const filteredCodes = serialCodes.filter(
        (item) =>
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Serial Codes</h1>
                <p className="text-muted-foreground">Search and manage all generated coupon codes</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>All Codes</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search code or customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="used">Used</SelectItem>
                                    <SelectItem value="unused">Unused</SelectItem>
                                </SelectContent>
                            </Select>
                            <ExportButton />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Serial Code</TableHead>
                                <TableHead>Batch Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Used Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCodes.length > 0 ? (
                                filteredCodes.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono font-medium">{item.code}</TableCell>
                                        <TableCell>{item.batch}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        <TableCell>{item.customer}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No codes found
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
