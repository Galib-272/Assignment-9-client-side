"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";

const passwordRules = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
];

function PasswordStrength({ password }) {
  if (!password) return null;
  return (
    <ul className="mt-2 space-y-1">
      {passwordRules.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 text-[11px] font-medium ${
              passed ? "text-green-500" : "text-red-400"
            }`}
          >
            <span>{passed ? "✓" : "✗"}</span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

const inputClass =
  "appearance-none rounded-lg block w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/my-ideas";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isPasswordValid = passwordRules.every((r) => r.test(password));

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !image.trim() || !password.trim()) {
      toast.error("Please fill in all core initialization fields.");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Password does not meet the requirements.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await authClient.signUp.email({
        email, password, name, image,
        callbackURL: redirectTo,
      });
      if (response?.error) throw new Error(response.error.message || "Registration rejected.");
      toast.success("Identity profile committed successfully!");
      router.push(redirectTo);
    } catch (err) {
      toast.error(err.message || "Failed to finalize credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Save intended destination, then land on /auth/callback to sync session
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      sessionStorage.setItem("auth-redirect", redirectTo);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/callback`,
      });
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Google sign-in failed. Please try email registration instead.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-gray-50 dark:bg-gray-800/40 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm transition-colors duration-300">
        <h2 className="text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Register Vault Identity
        </h2>

        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text" required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Alex Mercer"
            />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="name@domain.com"
            />
          </div>
          <div>
            <label className={labelClass}>Profile Image URL</label>
            <input
              type="url" required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputClass}
              placeholder="https://images.com/avatar.jpg"
            />
          </div>
          <div>
            <label className={labelClass}>Secure Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-medium transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (password.length > 0 && !isPasswordValid)}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Initializing..." : "Initialize Vault Profile"}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 dark:bg-gray-800 px-2 text-gray-400">
              Or continue via
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span>{googleLoading ? "Redirecting..." : "Continue with Google"}</span>
        </button>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-light">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Access vault profile
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 text-sm transition-colors duration-300">
          Loading registration panel...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.93 12c0-.79.13-1.57.39-2.31V6.54H1.21A11.93 11.93 0 0 0 0 12c0 2.12.55 4.12 1.52 5.87l3.8-3.63z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.87l3.8 3.15c.94-2.85 3.57-4.96 6.99-4.96z" />
    </svg>
  );
}