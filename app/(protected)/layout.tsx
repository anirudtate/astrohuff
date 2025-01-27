"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/db";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (!loading && !user) {
        router.push("/login");
        return;
      }

      if (user) {
        const profile = await getUserProfile(user.uid);
        if (!profile?.onboardingCompleted) {
          router.push("/onboarding");
        }
        setCheckingProfile(false);
      }
    }

    checkAuth();
  }, [user, loading, router]);

  if (loading || checkingProfile) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
