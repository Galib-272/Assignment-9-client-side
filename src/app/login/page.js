"use client";

import { useState, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

function LoginContent() {
  const { setUser } = useContext(AppContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one uppercase letter.");
        return;
      }
      if (!/[a-z]/.test(password)) {
        toast.error("Password must contain at least one lowercase letter.");
        return;
      }
    }

    const mockUserData = {
      email: email,
      displayName: isRegistering ? name : email.split("@")[0],
      photoURL: isRegistering && photoURL ? photoURL : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
    };

    setUser(mockUserData);
    toast.success(isRegistering ? "Account registered successfully!" : "Logged in successfully!");
    
    const redirectTo = searchParams.get("redirectTo") || "/ideas";
    router.push(redirectTo);
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-8 rounded-xl shadow-sm">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          {isRegistering ? "Create your account" : "Sign in to your vault"}
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light">
          {isRegistering ? "Join our global ecosystem of co-creators" : "Access guarded formulas and community validation tools"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Photo URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/photo.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {!isRegistering && (
          <div className="flex justify-end">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline select-none cursor-pointer">
              Forgot Password?
            </span>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-lg transition duration-200 shadow-sm"
          >
            {isRegistering ? "Register Profile" : "Open Session"}
          </button>
        </div>
      </form>

      <div className="text-center pt-2">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
        >
          {isRegistering ? "Already have a profile? Sign In here" : "New to IdeaVault? Register an identity here"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading vault interface...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}