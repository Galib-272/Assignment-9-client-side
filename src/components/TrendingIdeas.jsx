"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const componentMountTime = Date.now();

    fetch("http://localhost:5000/ideas")
      .then((res) => res.json())
      .then((data) => {
        const networkElapsedTime = Date.now() - componentMountTime;
        const targetLoadingDelay = 1500;
        const remainingDelayGate = Math.max(
          0,
          targetLoadingDelay - networkElapsedTime,
        );

        setTimeout(() => {
          if (Array.isArray(data)) {
            const publicCoreCards = data
              .filter((item) => !item.authorEmail && !item.userEmail)
              .slice(0, 6);
            setIdeas(publicCoreCards);
          }
          setLoading(false);
        }, remainingDelayGate);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-900 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
          Synchronizing with database cloud repository...
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trending Startup Ideas
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400 font-light mt-3">
            Explore the most validated concepts circulating through the
            ecosystem this week.
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-sm text-gray-400">
              No active concept models deployed in database clusters yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 h-full group"
              >
                <div className="w-full h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3">
                      {idea.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
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
                      className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 px-4 rounded-md transition-all duration-200 shadow-sm"
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
    </section>
  );
}
