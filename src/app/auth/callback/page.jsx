"use client";

import { useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { loginWithGoogle } = useContext(AppContext);
  const runOnce = useRef(false);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;

    const handleAuthSync = async () => {
      try {
        // 1. Fetch active session state from Better-Auth client layer
        const response = await authClient.getSession();
        console.log("Better-Auth RAW Response:", response);

        // 2. Defensive checks to extract email correctly from Better-Auth's payload variations
        const targetUser = response?.data?.user || response?.user || response?.data?.session?.user;

        if (targetUser && targetUser.email) {
          console.log("Extracted User Data successfully:", targetUser);

          // 3. Exchange Better-Auth profiles with your custom Express JWT logic
          const result = await loginWithGoogle(targetUser.email, {
            name: targetUser.name,
            image: targetUser.image,
          });

          if (result && result.success) {
            const intendedRedirect = sessionStorage.getItem("auth-redirect") || "/my-ideas";
            sessionStorage.removeItem("auth-redirect");
            
            // Navigate forward to protected area
            router.push(intendedRedirect);
          } else {
            console.error("AppContext loginWithGoogle rejected the transaction.");
            toast.error("Internal authentication sync failed.");
            router.push("/login");
          }
        } else {
          console.error("Better-Auth did not provide a recognizable user profile structure.", response);
          toast.error("Google authentication profile extraction failed.");
          router.push("/login");
        }
      } catch (err) {
        console.error("Callback catch process crashed entirely:", err);
        router.push("/login");
      }
    };

    handleAuthSync();
  }, [router, loginWithGoogle]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-3 text-gray-500 text-sm transition-colors duration-300">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
      <p className="font-medium animate-pulse">Synchronizing clearance profile...</p>
    </div>
  );
}