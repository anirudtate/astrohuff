"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (
        !profile?.onboardingCompleted &&
        !pathname.includes("/onboarding")
      ) {
        router.replace("/onboarding");
      }
      setChecking(false);
    }
  }, [user, profile, loading, router, pathname]);

  if (loading || checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (
    !user ||
    (!profile?.onboardingCompleted && !pathname.includes("/onboarding"))
  ) {
    return null;
  }

  return <>{children}</>;
}
