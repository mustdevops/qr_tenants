import { useRouter } from "next/navigation"; // make sure this is imported
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActionCell = ({ row, onEdit, onDelete }) => {
  const router = useRouter();
  const pkg = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onEdit ? onEdit(pkg) : router.push(`/agent/packages/edit/${pkg.id}`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Package
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => onDelete ? onDelete(pkg) : console.log("Delete", pkg.id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Package
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Convert PackagesColumns to a function that accepts handlers
export const PackagesColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "name",
    header: "Package Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "credits",
    header: "Credits",
    cell: ({ row }) => row.original.credits,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `${row.original.currency} ${row.original.price}`,
  },
  {
    accessorKey: "price_per_credit",
    header: "Price / Credit",
  },
  {
    accessorKey: "credit_type",
    header: "Credit Type",
  },
  {
    accessorKey: "merchant_type",
    header: "Merchant Type",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "success" : "destructive"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "sort_order",
    header: "Sort Order",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} onEdit={onEdit} onDelete={onDelete} />,
  },
];
