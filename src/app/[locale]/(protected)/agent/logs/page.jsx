import SystemLogsContainer from "@/containers/logs/system-logs";

export default function AgentLogsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
                <p className="text-muted-foreground">
                    Monitor merchant activities, wallet transactions, and commission logs.
                </p>
            </div>
            <SystemLogsContainer scope="agent" />
        </div>
    );
}
