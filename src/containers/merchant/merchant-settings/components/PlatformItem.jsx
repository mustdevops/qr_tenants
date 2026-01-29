import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from "lucide-react";

export default function PlatformItem({
    icon,
    label,
    color,
    enabled,
    onToggle,
    link,
    onLinkChange,
    placeholder,
}) {
    return (
        <div
            className={`rounded-2xl border transition-all duration-500 overflow-hidden ${enabled
                ? `bg-white shadow-md border-primary/20 scale-[1.01]`
                : "bg-muted/5 border-muted/30 scale-100"
                }`}
        >
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {icon}
                    </div>
                    <Label
                        className={`text-sm font-semibold cursor-pointer ${enabled ? "text-foreground" : "text-muted-foreground"
                            }`}
                    >
                        {label}
                    </Label>
                </div>
                <Switch
                    checked={enabled}
                    onCheckedChange={onToggle}
                    className="data-[state=checked]:bg-primary shadow-xs"
                />
            </div>

            <div
                className={`grid transition-all duration-300 ease-in-out ${enabled
                    ? "grid-rows-[1fr] opacity-100 pb-4 px-4"
                    : "grid-rows-[0fr] opacity-0 p-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="relative">
                        <Input
                            value={link}
                            onChange={onLinkChange}
                            placeholder={placeholder}
                            className="pl-10 bg-muted/30 border-muted/40 focus:bg-white focus-visible:ring-primary/30 transition-all rounded-xl"
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </div>
    );
}
