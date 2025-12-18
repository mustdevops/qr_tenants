"use client";

import { Wallet, TrendingUp } from "lucide-react";
import { PageTabs } from "@/components/common/page-tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreadcrumbComponent } from "@/components/common/breadcrumb-component";
import { DataTable } from "@/components/common/data-table";
import TableToolbar from "@/components/common/table-toolbar";
import { useState } from "react";

export default function AgentWalletContainer() {
  // Dummy balance data
  const currentBalance = 45000;
  const pendingBalance = 3500;

  // Dummy transactions
  const transactions = [
    {
      id: 1,
      date: "2024-06-01",
      description: "Commission from Coffee House",
      amount: 250,
      type: "credit",
      status: "paid",
    },
    {
      id: 2,
      date: "2024-05-28",
      description: "Commission from Pizza Palace",
      amount: 180,
      type: "credit",
      status: "paid",
    },
    {
      id: 3,
      date: "2024-05-25",
      description: "Withdrawal to bank",
      amount: -5000,
      type: "debit",
      status: "completed",
    },
    {
      id: 4,
      date: "2024-05-20",
      description: "Commission from Beauty Salon",
      amount: 320,
      type: "credit",
      status: "paid",
    },
    {
      id: 5,
      date: "2024-05-18",
      description: "Commission from Pet Store",
      amount: 150,
      type: "credit",
      status: "pending",
    },
  ];

  // Dummy auto-deductions
  const autoDeductions = [
    {
      id: 1,
      date: "2024-06-01",
      description: "Platform fee",
      amount: 50,
      frequency: "Monthly",
    },
    {
      id: 2,
      date: "2024-05-01",
      description: "Platform fee",
      amount: 50,
      frequency: "Monthly",
    },
    {
      id: 3,
      date: "2024-04-01",
      description: "Platform fee",
      amount: 50,
      frequency: "Monthly",
    },
  ];

  /* ============================
       Auto-deductions state
    ============================ */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const filteredDeductions = autoDeductions.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedDeductions = filteredDeductions.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const deductionColumns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-red-600">-${row.original.amount}</span>
      ),
    },
    { accessorKey: "frequency", header: "Frequency" },
  ];

  /* ============================
       Transactions state (FIX)
    ============================ */
  const [transactionPage, setTransactionPage] = useState(0);
  const [transactionPageSize, setTransactionPageSize] = useState(10);
  const [transactionSearch, setTransactionSearch] = useState("");

  const filteredTransactions = transactions.filter((item) =>
    item.description.toLowerCase().includes(transactionSearch.toLowerCase())
  );

  const paginatedTransactions = filteredTransactions.slice(
    transactionPage * transactionPageSize,
    (transactionPage + 1) * transactionPageSize
  );

  const transactionColumns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span
          className={
            row.original.amount >= 0 ? "text-green-600" : "text-red-600"
          }
        >
          {row.original.amount >= 0 ? "+" : "-"}${Math.abs(row.original.amount)}
        </span>
      ),
    },
    { accessorKey: "status", header: "Status" },
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
                <CardTitle className="text-sm font-medium">
                  Current Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${currentBalance.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12.5%</span>
                  <span>from last month</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${pendingBalance.toLocaleString()}
                </div>
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
                Request a withdrawal from your available balance to your
                registered bank account.
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
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TableToolbar
              placeholder="Search transactions..."
              onSearchChange={setTransactionSearch}
            />
            <DataTable
              data={paginatedTransactions}
              columns={transactionColumns}
              page={transactionPage}
              pageSize={transactionPageSize}
              total={filteredTransactions.length}
              setPage={setTransactionPage}
              setPageSize={setTransactionPageSize}
            />
          </CardContent>
        </Card>
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
            <TableToolbar
              placeholder="Search deductions..."
              onSearchChange={setSearch}
            />
            <DataTable
              data={paginatedDeductions}
              columns={deductionColumns}
              page={page}
              pageSize={pageSize}
              total={filteredDeductions.length}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const breadcrumbData = [
    { name: "Agent Dashboard", url: "/en/agent/dashboard" },
    { name: "Agent Wallet", url: "/en/agent/wallet" },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbComponent data={breadcrumbData} />
      <div>
        <h1 className="text-3xl font-bold">Agent Wallet</h1>
        <p className="text-muted-foreground">
          Manage your earnings and withdrawals
        </p>
      </div>

      <PageTabs tabs={tabs} defaultTab="balance" />
    </div>
  );
}
