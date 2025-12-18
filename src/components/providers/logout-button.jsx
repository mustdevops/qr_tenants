"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push("/en/login");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}

