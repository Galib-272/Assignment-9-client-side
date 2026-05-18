"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "IdeaVault | 404 Not Found";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center max-w-md w-full space-y-6">
        <h1 className="text-9xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Matrix Node Missing
        </h2>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          The requested concept routing layer or structural address index could
          not be located inside the data repository.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-lg transition duration-150 shadow-sm"
          >
            Return to Core Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
