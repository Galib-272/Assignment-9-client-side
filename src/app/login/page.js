"use client";

import { useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useContext(AppContext);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/my-ideas";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please provide complete credentials.");
      return;
    }

    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectTo);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (err) {
      toast.error("Google authentication channel failed.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-8 rounded-2xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {"Access Workspace Matrix"}
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light">
            {"Synchronize credentials to access premium business parameters."}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {"Account Email Vector"}
              </label>

              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {"Security Access Passcode"}
                </label>

                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer transition-colors font-medium">
                  {"Forgot Passcode Matrix?"}
                </span>
              </div>

              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
            >
              {isSubmitting
                ? "Authorizing Parameters..."
                : "Verify Credentials"}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-bold text-sm py-3 rounded-xl transition duration-200 shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.82z"
              />

              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
              />

              <path
                fill="#FBBC05"
                d="M5.32 14.24A7.16 7.16 0 0 1 4.93 12c0-.79.13-1.57.39-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"
              />

              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.23c.94-2.85 3.57-4.94 6.68-4.94z"
              />
            </svg>

            <span>Continue with Google</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            {"New to the vault structure? "}

            <Link
              href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {"Register Cluster Account"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
