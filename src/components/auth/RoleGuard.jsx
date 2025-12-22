"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";

export default function RoleGuard({ allowedRoles = [], children }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const user = session?.user;
    const role = (user?.role || "").toLowerCase();

    if (!user) {
      router.push("/login");
      return;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.map((r) => r.toLowerCase()).includes(role)
    ) {
      // not allowed
      router.push("/login");
    }
  }, [router, session, status, allowedRoles]);

  return children;
}
