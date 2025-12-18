import { StatusBadge } from "./status-badge";
import { Award } from "lucide-react";

export function SubscriptionBadge({ type, showIcon = true }) {
    return (
        <div className="flex items-center gap-2">
            {showIcon && <Award className="h-4 w-4" />}
            <StatusBadge status={type} />
        </div>
    );
}
