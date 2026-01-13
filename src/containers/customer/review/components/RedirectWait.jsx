"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Zap,
  SquareCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const RedirectWait = ({ nextStep, prevStep, merchantConfig }) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = [
    {
      label: "Submitting Feedback",
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      sub: "Securing your data...",
    },
    {
      label: "Verifying Redirect",
      icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
      sub: "Linking your review platform...",
    },
    {
      label: "Almost Ready!",
      icon: <SquareCheck className="w-8 h-8 text-green-500" />,
      sub: "Preparing your reward...",
    },
  ];

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 1500);

    const mainTimer = setTimeout(() => {
      nextStep();
    }, 4500);

    return () => {
      clearInterval(statusTimer);
      clearTimeout(mainTimer);
    };
  }, [nextStep, statuses.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 text-primary">
                <Zap className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {statuses[statusIndex].label}
                </CardTitle>
                <CardDescription>
                  {statuses[statusIndex].sub}
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              className="h-9 rounded-md gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent className="py-16 flex flex-col items-center gap-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
              <div className="text-primary scale-150 transform transition-all duration-700">
                {statusIndex === 0 && <Zap className="w-8 h-8" />}
                {statusIndex === 1 && <ShieldCheck className="w-8 h-8" />}
                {statusIndex === 2 && <SquareCheck className="w-8 h-8 animate-bounce" />}
              </div>
            </div>
            {/* Pulsing rings */}
            <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping opacity-20"></div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-[4.5s] ease-linear rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">
              System Encryption Active
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 italic text-center max-w-sm">
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              "We are finalizing your feedback and preparing your reward tokens. Please do not close this window."
            </p>
          </div>
        </CardContent>

        <CardFooter className="bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-800 py-4 flex justify-center">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            Secure Redirection Active <ShieldCheck className="w-3 h-3 text-primary" /> Powered by QR Tenants
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
