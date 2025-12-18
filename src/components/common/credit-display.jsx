import { CreditCard } from "lucide-react";

export function CreditDisplay({ credits, className = "" }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">
                {credits.toLocaleString()} Credits
            </span>
        </div>
    );
}
