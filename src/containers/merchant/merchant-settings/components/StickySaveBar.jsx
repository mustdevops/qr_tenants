import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

export default function StickySaveBar({ loading, onSave }) {
  return (
    <div className=" py-8 border border-muted/20 bg-white shadow-xl shadow-gray-200/50 rounded-2xl flex items-center min-h-20  animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto w-full px-8 flex items-center justify-between">
        <div className="items-center gap-2.5 text-muted-foreground hidden md:flex">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          <span className="text-sm font-medium">
            Changes apply immediately upon save
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto ml-auto md:ml-0">
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="hover:bg-gray-100 rounded-lg px-6 h-11 text-sm font-semibold transition-colors"
          >
            Discard
          </Button>

          <Button
            onClick={onSave}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-lg px-8 h-11 font-bold text-sm flex items-center gap-2.5 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save All Settings</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
