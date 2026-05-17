"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setIdeas(data))
      .catch((err) => console.error(err));
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

  const categories = ["All", "Education", "Health", "Tech", "FinTech", "AI"];

  const filteredIdeas = ideas.filter((idea) => {
    const matchesCategory =
      selectedCategory === "All" || idea.category === selectedCategory;
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Explore Startup Ideas
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400 font-light">
            Search, filter, and discover community-driven startup formulas
            waiting for validation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-12 w-full relative z-40">
          <div className="w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search ideas by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <div className="relative w-full sm:w-64" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left transition-all"
            >
              <span>
                Category:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {selectedCategory}
                </strong>
              </span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 py-1 origin-top-right focus:outline-none">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredIdeas.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400 font-light text-lg">
              No matching startup concepts found. Try adapting your filters or
              keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {filteredIdeas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full"
              >
                <div className="w-full h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3">
                      {idea.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-light line-clamp-3 mb-4 leading-relaxed">
                      {idea.shortDescription}
                    </p>
                  </div>

                  <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-4 mt-auto">
                    <div className="flex flex-col gap-1 mb-5 text-xs text-gray-500 dark:text-gray-400 font-light">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Audience:{" "}
                        </span>
                        {idea.targetAudience}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Est. Budget:{" "}
                        </span>
                        {idea.estimatedBudget}
                      </div>
                    </div>

                    <Link
                      href={`/ideas/${idea._id}`}
                      className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 px-4 rounded-md transition duration-200 shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
