import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const getLogColumns = () => [
    {
        accessorKey: "created_at",
        header: "Date & Time",
        cell: ({ row }) => {
            const date = row.getValue("created_at");
            return date ? format(new Date(date), "MMM dd, yyyy HH:mm:ss") : "N/A";
        },
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const action = row.getValue("action");
            return (
                <Badge variant="outline" className="capitalize">
                    {action?.replace(/_/g, " ") || "system"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "user_type",
        header: "User Type",
        cell: ({ row }) => (
            <span className="capitalize">{row.getValue("user_type") || "System"}</span>
        ),
    },
    {
        accessorKey: "message",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate font-medium" title={row.getValue("message")}>
                {row.getValue("message")}
            </div>
        ),
    },
    {
        accessorKey: "level",
        header: "Severity",
        cell: ({ row }) => {
            const level = row.getValue("level")?.toLowerCase();
            let variant = "secondary";
            if (level === "critical" || level === "error") variant = "destructive";
            if (level === "warning") variant = "warning";
            if (level === "info" || level === "success") variant = "success";

            return (
                <Badge variant={variant} className="capitalize">
                    {level || "info"}
                </Badge>
            );
        },
    },
];
