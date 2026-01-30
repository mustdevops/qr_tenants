import React, { useMemo, useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function BatchSelector({
    selectedId,
    merchantId,
    isOpen,
    setIsOpen,
    onSelect,
    placeholder,
    className = "",
    // Optional overrides if needed in future, but primarily internal fetch now
    batches: propBatches,
    loading: propLoading,
}) {
    const [internalBatches, setInternalBatches] = useState([]);
    const [internalLoading, setInternalLoading] = useState(false);

    // Prefer props if provided, otherwise use internal state
    const batches = propBatches || internalBatches;
    const loading = propLoading !== undefined ? propLoading : internalLoading;

    useEffect(() => {
        // If batches are provided via props, don't fetch
        if (propBatches) return;
        if (!merchantId) return;

        const fetchBatches = async () => {
            setInternalLoading(true);
            try {
                const res = await axiosInstance.get("/coupon-batches", {
                    params: { page: 1, pageSize: 50, merchantId },
                });
                const data = res?.data?.data || res?.data || {};
                setInternalBatches(data.batches || []);
            } catch (error) {
                console.error("Failed to load coupon batches:", error);
            } finally {
                setInternalLoading(false);
            }
        };

        fetchBatches();
    }, [merchantId, propBatches]);

    // Find the selected batch object
    const selectedBatch = useMemo(() =>
        batches.find((b) => b.id === selectedId),
        [batches, selectedId]);

    // Handle value change: Shadcn Select returns the value directly
    const handleValueChange = (value) => {
        onSelect(value);
    };

    return (
        <Select
            value={selectedId || ""}
            onValueChange={handleValueChange}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SelectTrigger className={`w-full h-auto py-2 ${className}`}>
                <div className="flex flex-col items-start text-left w-full overflow-hidden">
                    <span
                        className={`text-sm truncate w-full ${selectedId
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                            }`}
                    >
                        {selectedId
                            ? selectedBatch?.batch_name || `Batch #${selectedId}`
                            : placeholder}
                    </span>
                    {selectedBatch && (
                        <span className="text-[10px] text-muted-foreground">
                            {selectedBatch.issued_quantity || 0}/
                            {selectedBatch.total_quantity || 0} claimed
                        </span>
                    )}
                </div>
            </SelectTrigger>
            <SelectContent className="max-h-[160px]">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : batches.length === 0 ? (
                    <div className="py-3 px-4 text-xs text-muted-foreground text-center">
                        No batches found
                    </div>
                ) : (
                    batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id} className="py-2.5 cursor-pointer">
                            <div className="flex flex-col text-left">
                                <span className="font-medium text-sm truncate">
                                    {batch.batch_name}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate">
                                    {batch.description || "No description"}
                                </span>
                            </div>
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
}
