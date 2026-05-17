"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { user, theme, toggleTheme, logout } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              IdeaVault
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              href="/ideas"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
            >
              Ideas
            </Link>
            {user && (
              <>
                <Link
                  href="/add-idea"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
                >
                  Add Idea
                </Link>
                <Link
                  href="/my-ideas"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
                >
                  My Ideas
                </Link>
                <Link
                  href="/my-interactions"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
                >
                  My Interactions
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xl transition-colors focus:outline-none"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex text-sm border-2 border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-indigo-500"
                >
                  <img
                    className="h-9 w-9 rounded-full object-cover"
                    src={
                      user.photoURL ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                    }
                    alt="User profile"
                  />
                </button>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black/5 border border-gray-100 dark:border-gray-700">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile Management
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                Login / Register
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-lg"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-xl"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-1 shadow-inner">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/ideas"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
          >
            Ideas
          </Link>
          {user && (
            <>
              <Link
                href="/add-idea"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
              >
                Add Idea
              </Link>
              <Link
                href="/my-ideas"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
              >
                My Ideas
              </Link>
              <Link
                href="/my-interactions"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
              >
                My Interactions
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
              >
                Profile Management
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
              >
                Sign out
              </button>
            </>
          )}
          {!user && (
            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium shadow-sm"
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
