"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";

export default function IdeasExplorePage() {
  const { user, authLoading } = useContext(AppContext);

  const [ideas, setIdeas] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    document.title = "IdeaVault | Explore Ideas";
  }, []);

  useEffect(() => {
    const pageMountTime = Date.now();

    const url = `http://localhost:5000/ideas?search=${search}&category=${category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (initialLoading) {
          const networkElapsedTime = Date.now() - pageMountTime;
          const targetLoadingDelay = 1500;

          const remainingDelayGate = Math.max(
            0,
            targetLoadingDelay - networkElapsedTime,
          );

          setTimeout(() => {
            if (Array.isArray(data)) {
              if (!user) {
                const publicCoreCards = data.filter(
                  (item) => !item.authorEmail && !item.userEmail,
                );

                setIdeas(publicCoreCards);
              } else {
                setIdeas(data);
              }
            }

            setInitialLoading(false);
          }, remainingDelayGate);
        } else {
          if (Array.isArray(data)) {
            if (!user) {
              const publicCoreCards = data.filter(
                (item) => !item.authorEmail && !item.userEmail,
              );

              setIdeas(publicCoreCards);
            } else {
              setIdeas(data);
            }
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setInitialLoading(false);
      });
  }, [search, category, user]);

  const categories = ["All", "Tech", "Health", "AI", "Education", "FinTech"];

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />

        <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
          {"Synchronizing idea matrix pool..."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {"Explore Concept Formulations"}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
              {user
                ? "Reviewing complete cluster including user-deposited startup models."
                : "Displaying public baseline configurations. Log in to unlock premium peer-deposited ideas."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Search concepts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-955/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {ideas.length === 0 ? (
          <p className="text-sm text-gray-400 font-light italic text-center py-12">
            {"No configurations localized matching current filtering criteria."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full"
              >
                <div className="w-full h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
                  <img
                    src={
                      idea.image ||
                      idea.imageURL ||
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
                    }
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
                          {"Audience: "}
                        </span>

                        {idea.targetAudience || idea.targetDemographics}
                      </div>

                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {"Est. Budget: "}
                        </span>

                        {idea.estimatedBudget || idea.estimatedLaunchBudget}
                      </div>
                    </div>

                    <Link
                      href={`/ideas/${idea._id}`}
                      className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 rounded-md transition duration-200 shadow-sm"
                    >
                      {"View Details"}
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
