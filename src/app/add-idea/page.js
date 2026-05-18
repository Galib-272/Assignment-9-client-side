"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function AddIdeaPage() {
  const { user, authLoading } = useContext(AppContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [image, setImage] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [tags, setTags] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");

  useEffect(() => {
    document.title = "IdeaVault | Add Concept";
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/add-idea");
    }
  }, [user, authLoading, router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !image.trim() ||
      !shortDescription.trim() ||
      !detailedDescription.trim() ||
      !targetAudience.trim() ||
      !problemStatement.trim() ||
      !proposedSolution.trim()
    ) {
      toast.error("Please fill out all mandatory architectural parameters.");
      return;
    }

    const freshIdea = {
      title,
      category,
      image,
      shortDescription,
      description: detailedDescription,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      estimatedBudget: estimatedBudget || "N/A",
      targetAudience,
      problemStatement,
      proposedSolution,
      authorEmail: user?.email,
    };

    const token =
      localStorage.getItem("vault-token") || localStorage.getItem("token");

    fetch("http://localhost:5000/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(freshIdea),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Server structural rejection.");
        }
        return res.json();
      })
      .then(() => {
        toast.success("Startup concept deposited into cluster repository!");
        router.push("/my-ideas");
      })
      .catch((err) => {
        console.error("Submission failed:", err);
        toast.error(`Insertion sequence fault: ${err.message}`);
      });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 font-light">
        {"Verifying credential parameters..."}
      </div>
    );
  }

  const categories = ["Tech", "Health", "AI", "Education", "FinTech"];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-8 rounded-2xl shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {"Deposit Startup Formula"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
              {
                "Log your architectural concept parameters directly into the guarded community matrix."
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {"Concept Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., HealthSync AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {"Category *"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {"Concept Banner Graphic URL *"}
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/your-image-vector"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {"Estimated Budget"}
                </label>
                <input
                  type="text"
                  placeholder="e.g., $25,000"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {"Target Audience *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Medical Personnel"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {"Tags (Comma Separated)"}
                </label>
                <input
                  type="text"
                  placeholder="saas, ai, automation"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {"Short Description Summary *"}
              </label>
              <input
                type="text"
                required
                placeholder="Brief high-level overview capsule..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {"Detailed Description Specifications *"}
              </label>
              <textarea
                rows="3"
                required
                placeholder="Elaborate deep technical architectural workflow metrics details..."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {"Problem Statement Matrix *"}
              </label>
              <textarea
                rows="2"
                required
                placeholder="What critical core ecosystem inefficiency are you identifying?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {"Proposed Solution Layout *"}
              </label>
              <textarea
                rows="2"
                required
                placeholder="Detail exactly how your architectural formulation resolves this friction..."
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition duration-200 shadow-sm"
              >
                {"Publish New Concept Formulation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
