"use client";

import { useState } from "react";
import { ArrowLeft, Upload, LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSubscriptionType } from "@/lib/auth-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MerchantCreateCouponContainer() {
    const router = useRouter();
    const subscriptionType = getSubscriptionType();
    const isAnnual = subscriptionType === "annual";
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push("/en/merchant/coupons");
        }, 1500);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/en/merchant/coupons">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Create Coupon Batch</h1>
                    <p className="text-muted-foreground">Generate new serial codes for your campaign</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Form */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Details</CardTitle>
                            <CardDescription>Configure your coupon parameters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Batch Name</Label>
                                    <Input id="name" placeholder="e.g. Summer Sale 2024" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            placeholder="100"
                                            max={isAnnual ? 10000 : 500}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Limit: {isAnnual ? "10,000" : "500"} codes
                                            {!isAnnual && " (Upgrade for more)"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Discount Value</Label>
                                        <Input id="discount" placeholder="e.g. 20%" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="validity">Valid Until</Label>
                                    <Input id="validity" type="date" required />
                                </div>

                                <div className="space-y-2">
                                    <Label>Coupon Design</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer h-32">
                                            <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                                            <span className="text-sm font-medium">Upload Background</span>
                                            <span className="text-xs text-muted-foreground">JPG, PNG</span>
                                        </div>
                                        <div className="border-2 border-muted rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer h-32">
                                            <LayoutTemplate className="h-6 w-6 mb-2 text-muted-foreground" />
                                            <span className="text-sm font-medium">Use Template</span>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Generating Codes..." : "Generate Batch"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview & Tips */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary">Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[3/2] rounded-lg bg-white border shadow-sm p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 transform translate-x-2 translate-y-2 rotate-45">
                                    SALE
                                </div>
                                <div className="h-full flex flex-col justify-between">
                                    <div className="text-center mt-2">
                                        <h3 className="font-bold text-lg">Summer Sale</h3>
                                        <p className="text-2xl font-black text-primary my-1">20% OFF</p>
                                        <p className="text-xs text-muted-foreground">Valid until Dec 31, 2024</p>
                                    </div>
                                    <div className="bg-gray-100 p-2 text-center rounded border border-dashed border-gray-300">
                                        <p className="font-mono text-sm tracking-widest">ABCD-1234</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Use descriptive batch names to track performance easily.</p>
                            <p>• Set expiration dates to create urgency.</p>
                            <p>• Annual plan members can issue up to 10,000 coupons per batch.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
