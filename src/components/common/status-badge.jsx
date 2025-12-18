import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status, variant = "default" }) {
    const statusConfig = {
        // Subscription types
        annual: { label: "Annual", className: "bg-green-100 text-green-800 hover:bg-green-100" },
        temporary: { label: "Temporary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },

        // Activity status
        active: { label: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100" },
        inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },

        // Payment status
        paid: { label: "Paid", className: "bg-green-100 text-green-800 hover:bg-green-100" },
        pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
        failed: { label: "Failed", className: "bg-red-100 text-red-800 hover:bg-red-100" },

        // Coupon status
        exhausted: { label: "Exhausted", className: "bg-red-100 text-red-800 hover:bg-red-100" },
        expired: { label: "Expired", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },

        // Sync status
        'in-progress': { label: "In Progress", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
        completed: { label: "Completed", className: "bg-green-100 text-green-800 hover:bg-green-100" },

        // Ticket status
        open: { label: "Open", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
        resolved: { label: "Resolved", className: "bg-green-100 text-green-800 hover:bg-green-100" },

        // Serial code status
        used: { label: "Used", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
        unused: { label: "Unused", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    };

    const config = statusConfig[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    };

    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    );
}
