"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function AddIdeaPage() {
  const { user } = useContext(AppContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    category: "Tech",
    shortDescription: "",
    detailedDescription: "",
    tags: "",
    image: "",
    estimatedBudget: "",
    targetAudience: "",
    problemStatement: "",
    proposedSolution: "",
  });

  const categories = ["Tech", "Health", "AI", "Education", "FinTech"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success(
      `Startup strategy "${formData.title}" registered successfully!`,
    );
    router.push("/ideas");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 text-xl">
          🔒
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
          Access Restricted
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-light mb-6 max-w-sm text-sm">
          You must log into an authorized profile to deposit new business
          concept formulas.
        </p>
        <Link
          href="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-md text-sm shadow-sm"
        >
          Sign In to Contribute
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Deposit New Concept
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light">
            Formulate your raw strategy parameters to begin automated peer
            validation tracking.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Concept Title
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., EduPulse AI"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Primary Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                required
                placeholder="e.g., K-12 Classrooms"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Estimated Budget (Optional)
              </label>
              <input
                type="text"
                name="estimatedBudget"
                placeholder="e.g., $15,000"
                value={formData.estimatedBudget}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Tags / Focus Vectors (Optional)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., automation, live-metrics"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Problem Statement
            </label>
            <textarea
              name="problemStatement"
              required
              rows="2"
              placeholder="Define the core market friction points..."
              value={formData.problemStatement}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Proposed Solution
            </label>
            <textarea
              name="proposedSolution"
              required
              rows="2"
              placeholder="Detail the tactical technical answer to that problem statement..."
              value={formData.proposedSolution}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Short Preview Summary
            </label>
            <input
              type="text"
              name="shortDescription"
              required
              placeholder="A crisp single-line overview for explore grid cards..."
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Detailed Strategic Workflow Description
            </label>
            <textarea
              name="detailedDescription"
              required
              rows="4"
              placeholder="Break down scaling strategies, pipeline steps, and long-term milestones..."
              value={formData.detailedDescription}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-lg transition duration-200 shadow-sm"
            >
              Publish Strategy Formula
            </button>
            <Link
              href="/ideas"
              className="w-full sm:w-28 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm py-3 rounded-lg transition duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
