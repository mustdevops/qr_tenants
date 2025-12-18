import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartWrapper({ title, children, actions }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{title}</CardTitle>
                {actions && <div className="flex gap-2">{actions}</div>}
            </CardHeader>
            <CardContent>
                {children || (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Chart placeholder - integrate with chart library
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
