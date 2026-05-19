"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AppContext } from "@/context/AppContext";

export default function AuthCallbackPage() {
  const { loginWithGoogle } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    async function syncSession() {
      try {
        const session = await authClient.getSession();

        if (session?.data?.user) {
          const { name, email, image } = session.data.user;

          const { success } = await loginWithGoogle(email, { name, image });

          const intended = sessionStorage.getItem("auth-redirect") || "/my-ideas";
          sessionStorage.removeItem("auth-redirect");
          router.replace(success ? intended : "/login");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Session sync failed:", err);
        router.replace("/login");
      }
    }

    syncSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
      <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-light animate-pulse">
        Synchronizing Google credentials...
      </p>
    </div>
  );
}