"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StripeSettingsContainer() {
    const { data: session } = useSession();
    const [secretKey, setSecretKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [maskedKey, setMaskedKey] = useState("");
    const [hasKey, setHasKey] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const adminId = session?.user?.adminId || session?.user?.id;

    // Fetch existing Stripe settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            if (!adminId) return;

            try {
                setFetching(true);
                const response = await axiosInstance.get(`/stripe-settings/admin/${adminId}`);
                const data = response.data;

                setHasKey(data.hasKey || false);
                setMaskedKey(data.maskedKey || "");
                setIsActive(data.isActive || false);
            } catch (error) {
                console.error("Failed to fetch Stripe settings:", error);
                // Don't show error toast on initial load if settings don't exist
            } finally {
                setFetching(false);
            }
        };

        fetchSettings();
    }, [adminId]);

    const handleSave = async () => {
        if (!adminId) {
            toast.error("Unable to identify agent. Please log in again.");
            return;
        }

        // Validate key format
        if (!secretKey.trim()) {
            toast.error("Please enter a Stripe secret key");
            return;
        }

        if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
            toast.error("Invalid Stripe key format. Must start with sk_test_ or sk_live_");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/stripe-settings/admin/${adminId}`, {
                stripe_secret_key: secretKey,
            });

            const data = response.data;
            setMaskedKey(data.maskedKey || "");
            setHasKey(true);
            setIsActive(true);
            setSecretKey(""); // Clear input after save
            setShowKey(false);

            toast.success("Stripe secret key saved successfully");
        } catch (error) {
            console.error("Failed to save Stripe key:", error);
            toast.error(error.response?.data?.message || "Failed to save Stripe key");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!adminId) {
            toast.error("Unable to identify agent. Please log in again.");
            return;
        }

        if (!confirm("Are you sure you want to delete your Stripe secret key? This will disable payment processing for your merchants.")) {
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.delete(`/stripe-settings/admin/${adminId}`);

            setMaskedKey("");
            setHasKey(false);
            setIsActive(false);
            setSecretKey("");

            toast.success("Stripe secret key deleted successfully");
        } catch (error) {
            console.error("Failed to delete Stripe key:", error);
            toast.error(error.response?.data?.message || "Failed to delete Stripe key");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Stripe Settings</h1>
                <p className="text-muted-foreground">
                    Configure your Stripe secret key to enable payment processing for your merchants.
                </p>
            </div>

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Important:</strong> We use Stripe Hosted Checkout (redirect). Only your Stripe Secret Key is required.
                    Payments from your merchants will go directly to your Stripe account.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Stripe Secret Key
                    </CardTitle>
                    <CardDescription>
                        Your Stripe secret key is encrypted and stored securely. It will never be displayed in full after saving.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {hasKey && maskedKey && (
                        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Current Key</p>
                                    <p className="text-sm font-mono text-muted-foreground">{maskedKey}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isActive ? (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-sm font-medium">Active</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-yellow-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-sm font-medium">Inactive</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="stripe-key">
                            {hasKey ? "Update Stripe Secret Key" : "Enter Stripe Secret Key"}
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="stripe-key"
                                    type={showKey ? "text" : "password"}
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder="sk_test_... or sk_live_..."
                                    className="pr-10 font-mono"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowKey(!showKey)}
                                >
                                    {showKey ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Your key must start with <code className="bg-muted px-1 py-0.5 rounded">sk_test_</code> or{" "}
                            <code className="bg-muted px-1 py-0.5 rounded">sk_live_</code>
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div>
                        {hasKey && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Key"
                                )}
                            </Button>
                        )}
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={loading || !secretKey.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {hasKey ? "Update Key" : "Save Key"}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                            1
                        </div>
                        <p>
                            When your merchants initiate a payment (subscription upgrade, credit purchase, etc.), the system uses your Stripe secret key.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                            2
                        </div>
                        <p>
                            Customers are redirected to Stripe Hosted Checkout for secure payment processing.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                            3
                        </div>
                        <p>
                            Payments go directly to your Stripe account. You receive the full payment minus Stripe's processing fees.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
