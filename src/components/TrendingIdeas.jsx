"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setIdeas(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trending Startup Ideas
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400 font-light">
            Explore the most validated concepts circulating through the ecosystem this week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => (
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
      </div>
    </section>
  );
}