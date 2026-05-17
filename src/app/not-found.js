"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6 transition-colors duration-300">
      <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
        404
      </span>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
        Vault Location Displaced
      </h2>
      <p className="text-gray-500 dark:text-gray-400 font-light max-w-sm mb-6 text-sm leading-relaxed">
        The route identifier parameter you requested points to a sector sequence
        that has not been formulated yet.
      </p>
      <Link
        href="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition duration-200 shadow-sm"
      >
        Return to Safety Hub
      </Link>
    </div>
  );
}
