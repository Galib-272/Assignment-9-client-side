"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TrendingIdeas() {
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`${baseUrl}/ideas`)
      .then((res) => {
        if (!res.ok) throw new Error("Ecosystem data mapping failure.");
        return res.json();
      })
      .then((data) => {
        if (active) {
          const rawIdeas = Array.isArray(data) ? data : [];
          setTrendingIdeas(rawIdeas.slice(0, 6));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Trending ideas section fetch error:", err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trending Startup Ideas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-2">
            Explore the most validated concepts circulating through the
            ecosystem this week.
          </p>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 dark:text-gray-500 font-light tracking-wide animate-pulse">
              Querying live document collections...
            </p>
          </div>
        ) : trendingIdeas.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#111726]/40 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl max-w-4xl mx-auto transition-colors duration-300">
            <p className="text-sm text-gray-400 dark:text-gray-500 font-light italic">
              No active concept models deployed in database clusters yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingIdeas.map((idea, index) => {
              const itemKey = idea._id || idea.id || `trending-card-${index}`;
              const targetRouteId = idea._id || idea.id || "";

              return (
                <div
                  key={itemKey}
                  className="bg-white dark:bg-[#111726] border border-gray-200 dark:border-gray-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md dark:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div>
                    <div className="w-full h-48 overflow-hidden relative bg-gray-100 dark:bg-[#090d16]">
                      <img
                        src={idea.image}
                        alt={idea.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
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

                  <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-gray-50/80 dark:bg-[#131a2b]/40 transition-colors duration-300">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">
                        Budget
                      </span>
                      <span className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                        {idea.estimatedBudget || "N/A"}
                      </span>
                    </div>
                    {targetRouteId && (
                      <Link
                        href={`/ideas/${targetRouteId}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
                      >
                        View Analysis
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
