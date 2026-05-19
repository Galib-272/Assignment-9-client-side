"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://assignment-9-server-side.vercel.app" || "http://localhost:5000";

export default function IdeasExplorePage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => { if (active) setLoading(true); });

    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.append("search", search.trim());
    if (category !== "All") queryParams.append("category", category);

    fetch(`${baseUrl}/ideas?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not stable.");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setIdeas(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Data fetch error:", err);
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [search, category]);

  const categories = ["All", "Tech", "Health", "AI", "Education", "FinTech"];

  return (
    <div className="bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-white min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Explore Concept Repository
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-3 max-w-2xl leading-relaxed">
            Scan and analyze startup formulas logged across the global matrix node network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
          <div className="w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search concepts by title string..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="w-full sm:w-auto min-w-[200px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto px-5 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-all appearance-none pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "16px",
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white">
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[45vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
              Querying database document vectors...
            </p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#111726]/40 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl transition-colors duration-300">
            <p className="text-sm text-gray-400 dark:text-gray-500 font-light italic">
              No structural startup components matched your filtering parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="bg-white dark:bg-[#111726] border border-gray-200 dark:border-gray-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md dark:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <div className="w-full h-48 overflow-hidden relative bg-gray-100 dark:bg-[#090d16]">
                    <img
                      src={idea.image}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
                      }}
                    />
                    <span className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-md text-white shadow-md uppercase tracking-wider">
                      {idea.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight line-clamp-1 mb-2">
                      {idea.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light line-clamp-3 leading-relaxed">
                      {idea.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-gray-50 dark:bg-[#131a2b]/40 transition-colors duration-300">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Budget</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{idea.estimatedBudget || "N/A"}</span>
                  </div>
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
                  >
                    View Analysis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}