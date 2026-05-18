"use client";

import { useState, useContext, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

function AddIdeaContent() {
  const { user, authLoading } = useContext(AppContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [shortDescription, setShortDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/add-idea");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !shortDescription.trim() ||
      !targetAudience.trim() ||
      !estimatedBudget.trim() ||
      !image.trim()
    ) {
      toast.error("Please fill in all layout formulation parameters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("vault-token");

      const response = await fetch(`${baseUrl}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          shortDescription,
          targetAudience,
          estimatedBudget,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to commit concept matrix node.",
        );
      }

      toast.success(
        "Startup concept successfully deployed to database ledger!",
      );
      router.push("/ideas");
    } catch (err) {
      toast.error(err.message || "Execution node submission failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 text-sm">
        Verifying secure workspace parameters...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-xl mx-auto bg-gray-50 dark:bg-gray-800/40 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
          Deposit New Startup Concept
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Concept Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="e.g., EduPulse AI"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Category Segment
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            >
              <option value="Tech">Tech</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="FinTech">FinTech</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Short Description
            </label>
            <textarea
              required
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="Describe the structural framework parameters..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              required
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="e.g., K-12 Remote Schools"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Estimated Budget
            </label>
            <input
              type="text"
              required
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="e.g., $15,000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Concept Display Image URL
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Deploying Node..." : "Commit Concept Parameters"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddIdeaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 text-sm">
          Loading concept layout grid...
        </div>
      }
    >
      <AddIdeaContent />
    </Suspense>
  );
}
