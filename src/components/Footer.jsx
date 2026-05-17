"use client";

import Link from "next/link";
import {
  FaXTwitter,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              IdeaVault
            </h3>
            <p className="text-sm font-light max-w-sm leading-relaxed">
              A collaborative, secure hub engineered for global innovators to
              drop business concepts, acquire structural validation, and refine
              startup formulas collectively.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Explore Ideas
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas?category=Tech"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Tech Category
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas?category=AI"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  AI Category
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Contact & Connect
            </h4>
            <ul className="space-y-2 text-sm font-light">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-500" />
                <span>support@ideavault.co</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-indigo-500" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <FaLocationDot className="text-indigo-500" />
                <span>Innovation District, Suite 400</span>
              </li>
            </ul>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black dark:hover:text-white text-lg transition-colors"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-lg transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-lg transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs font-light">
          <p>
            &copy; {new Date().getFullYear()} IdeaVault. All rights reserved.
            Built for startup validation.
          </p>
        </div>
      </div>
    </footer>
  );
}
