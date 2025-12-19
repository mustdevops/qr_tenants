import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import QRImageDialogHover from "@/components/common/qr-image-dialog";

export const merchantsColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "subscription",
        header: "Subscription",
        cell: ({ row }) => <StatusBadge status={row.original.subscription} />,
    },
    { accessorKey: "joinDate", header: "Join Date" },
    {
        accessorKey: "qr",
        header: "QR",
        cell: ({ row }) => {
            const raw = row.original.raw || {};
            const img = raw.qr_code_image || raw.qr_code || null;
            return img ? <QRImageDialogHover imageBase64={img} filename={`qr-${row.original.id}.png`} label={`QR for ${row.original.name}`} /> : null;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Link href={`/en/agent/merchants/${row.original.id}`}>
                <Button variant="outline" size="sm">
                    View Details
                </Button>
            </Link>
        ),
    },
];
