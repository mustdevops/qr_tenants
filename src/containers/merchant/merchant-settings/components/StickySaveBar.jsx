import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

export default function StickySaveBar({ loading, onSave }) {
  return (
    <div className="sticky bottom-6 left-0 right-0 z-50 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative group">
          {/* Decorative Glow Effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-emerald-500/10 to-primary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative flex items-center justify-between gap-6 px-6 py-4 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-gray-200/50 rounded-2xl ring-1 ring-black/5">
            {/* Left: Status & Info */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-semibold text-gray-900">
                    Reward Strategy Ready
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium hidden md:block">
                  Synchronize all your platform rewards and engagement settings
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
                className="h-11 px-5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 font-medium text-sm transition-all flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Discard Changes</span>
              </Button>

              <Button
                onClick={onSave}
                disabled={loading}
                className="h-11 px-8 rounded-xl bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-900/20 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center gap-2.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save All settings</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
