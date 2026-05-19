"use client";

import { useContext, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useContext(AppContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) {
        setMounted(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavbarDisconnect = async () => {
    setIsDropdownOpen(false);
    await logout();
    router.push("/");
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Ideas", path: "/ideas" },
  ];

  const privateLinks = [
    { name: "Add Idea", path: "/add-idea" },
    { name: "My Ideas", path: "/my-ideas" },
    { name: "My Interactions", path: "/my-interactions" },
  ];

  const activeClass =
    "text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-1";
  const inactiveClass =
    "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400"
            >
              IdeaVault
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6 text-sm font-medium">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={pathname === link.path ? activeClass : inactiveClass}
              >
                {link.name}
              </Link>
            ))}
            {mounted && user &&
              privateLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={
                    pathname === link.path ? activeClass : inactiveClass
                  }
                >
                  {link.name}
                </Link>
              ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none"
              aria-label="Toggle Theme"
            >
              {!mounted ? (
                <div className="w-4 h-4" />
              ) : theme === "dark" ? (
                <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.036a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {mounted && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 focus:outline-none shadow-sm transition-all"
                >
                  <img
                    src={
                      user.image ||
                      user.photoURL ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                    }
                    alt={user.name || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {user.name || user.displayName || "Anonymous Expert"}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Profile Management
                    </Link>
                    <button
                      onClick={handleNavbarDisconnect}
                      className="block w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors"
                    >
                      Disconnect Session
                    </button>
                  </div>
                )}
              </div>
            ) : (
              mounted && (
                <Link
                  href={`/login?redirectTo=${pathname}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition duration-200 shadow-sm"
                >
                  Login / Register
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}