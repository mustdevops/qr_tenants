import SystemLogsContainer from "@/containers/logs/system-logs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AgentLogsPage() {
    const session = await getServerSession(authOptions);
    const agentId = session?.user?.adminId;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
                <p className="text-muted-foreground">
                    Monitor merchant activities, wallet transactions, and commission logs.
                </p>
            </div>
            <SystemLogsContainer scope="agent" agentId={agentId} />
        </div>
    );
}
