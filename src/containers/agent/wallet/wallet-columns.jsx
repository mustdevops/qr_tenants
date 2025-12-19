export const transactionColumns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span
        className={row.original.amount >= 0 ? "text-green-600" : "text-red-600"}
      >
        {row.original.amount >= 0 ? "+" : "-"}${Math.abs(row.original.amount)}
      </span>
    ),
  },
  { accessorKey: "status", header: "Status" },
];

export const deductionColumns = [
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
