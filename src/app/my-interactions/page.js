"use client";

import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

export default function MyInteractionsPage() {
  const { user } = useContext(AppContext);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          View Restricted
        </h2>
        <Link
          href="/login"
          className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-md text-sm shadow-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          My Interactions
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-8">
          Review recent verification discussions and community feedback logging
          cycles you participated in.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Commented Ideas Tracked
          </h3>
          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <Link
              href="/ideas/1"
              className="text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block tracking-tight"
            >
              EduPulse AI
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-light">
              “The proposed adaptive grading algorithm structure can easily
              compress server loads during peaks.”
            </p>
            <span className="block text-xs text-gray-400 font-mono pt-1">
              Timestamp Logged: May 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
