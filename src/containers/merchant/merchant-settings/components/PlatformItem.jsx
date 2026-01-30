import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from "lucide-react";

export default function PlatformItem({
    icon,
    label,
    enabled,
    onToggle,
    link,
    onLinkChange,
    placeholder,
}) {
    return (
        <div
            className={`rounded-xl border transition-all duration-500 ease-out overflow-hidden ${enabled
                ? "bg-white shadow-sm border-primary/20"
                : "bg-gray-50/20 border-gray-100 grayscale-[0.8] opacity-50"
                }`}
        >
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 flex items-center justify-center shrink-0 rounded-lg transition-all duration-500 ${enabled ? "bg-primary/5 shadow-inner" : "bg-gray-200"
                        }`}>
                        {React.cloneElement(icon, { className: "h-4.5 w-4.5" })}
                    </div>
                    <div className="space-y-0">
                        <Label
                            className={`text-sm font-semibold cursor-pointer transition-colors ${enabled ? "text-gray-900" : "text-gray-500"
                                }`}
                        >
                            {label}
                        </Label>
                    </div>
                </div>
            </div>

            <div
                className={`grid transition-all duration-500 ease-in-out ${enabled ? "grid-rows-[1fr] opacity-100 pb-3 px-3" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <LinkIcon className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                            value={link}
                            onChange={onLinkChange}
                            placeholder={placeholder}
                            className="pl-11 h-10 bg-gray-50/50 border-gray-200/60 focus:bg-white focus-visible:ring-primary/20 transition-all rounded-lg font-medium text-xs border-2 placeholder:text-muted-foreground/40"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
