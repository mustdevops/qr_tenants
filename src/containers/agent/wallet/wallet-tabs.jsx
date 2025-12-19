import { Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TableToolbar from "@/components/common/table-toolbar";
import { DataTable } from "@/components/common/data-table";

export const getWalletTabs = ({
  balances,
  transactions,
  deductions,
  transactionTable,
  deductionTable,
}) => [
  {
    value: "balance",
    label: "Balance",
    content: (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm">Current Balance</CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${balances.currentBalance.toLocaleString()}
              </div>
              <p className="text-xs flex gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12.5%</span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${balances.pendingBalance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Request</CardTitle>
          </CardHeader>
          <CardContent>
            <Button>Request Withdrawal</Button>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    value: "transactions",
    label: "Transactions",
    content: transactionTable,
  },
  {
    value: "auto-deductions",
    label: "Auto-Deductions",
    content: deductionTable,
  },
];
