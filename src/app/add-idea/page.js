"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://assignment-9-server-side.vercel.app" || "http://localhost:5000";

// Reusable input classes to avoid repetition
const inputClass = `w-full px-4 py-3 text-sm rounded-xl border 
  border-gray-200 dark:border-gray-800 
  bg-white dark:bg-[#151c2c] 
  text-gray-900 dark:text-white 
  placeholder-gray-400 dark:placeholder-gray-500 
  focus:outline-none focus:border-indigo-500 
  transition-all`;

const labelClass = "block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = "IdeaVault | Add Concept";
    let active = true;
    requestAnimationFrame(() => { if (active) setMounted(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login?redirectTo=/add-idea");
    }
  }, [user, authLoading, router, mounted]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !image.trim() || !shortDescription.trim() ||
        !detailedDescription.trim() || !targetAudience.trim() ||
        !problemStatement.trim() || !proposedSolution.trim()) {
      toast.error("Please fill out all mandatory architectural parameters.");
      return;
    }

    const freshIdea = {
      title, category, image, shortDescription,
      description: detailedDescription,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      estimatedBudget: estimatedBudget || "N/A",
      targetAudience, problemStatement, proposedSolution,
      email: user?.email,
      authorEmail: user?.email,
      userEmail: user?.email,
    };

    const token = localStorage.getItem("vault-token") || localStorage.getItem("token");

    fetch(`${baseUrl}/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  if (!mounted || authLoading || !user) {
    return (
      // ✅ was: bg-[#0b0f19] border-gray-800 hardcoded
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
          Verifying credential parameters...
        </p>
      </div>
    );
  }

  const categories = ["Tech", "Health", "AI", "Education", "FinTech"];

  return (
    // ✅ was: bg-[#0b0f19] text-white hardcoded
    <div className="bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-white min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ was: bg-[#111726] border-gray-800/80 hardcoded */}
        <div className="bg-white dark:bg-[#111726] border border-gray-200 dark:border-gray-800/80 p-8 rounded-2xl shadow-md dark:shadow-xl transition-colors duration-300">
          <div className="mb-8">
            {/* ✅ was: text-white hardcoded */}
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Deposit Startup Formula
            </h1>
            {/* ✅ was: text-gray-400 hardcoded */}
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-2">
              Log your architectural concept parameters directly into the guarded community matrix.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Concept Title *</label>
                <input
                  type="text" required
                  placeholder="e.g., HealthSync AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Category *</label>
                {/* ✅ was: border-gray-800 bg-[#151c2c] text-white hardcoded */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}
                      className="bg-white dark:bg-[#151c2c] text-gray-900 dark:text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Concept Banner Graphic URL *</label>
              <input
                type="url" required
                placeholder="https://images.unsplash.com/your-image-vector"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Estimated Budget</label>
                <input
                  type="text" placeholder="e.g., $25,000"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Target Audience *</label>
                <input
                  type="text" required placeholder="e.g., Medical Personnel"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Tags (Comma Separated)</label>
                <input
                  type="text" placeholder="saas, ai, automation"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Short Description Summary *</label>
              <input
                type="text" required
                placeholder="Brief high-level overview capsule..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Detailed Description Specifications *</label>
              <textarea
                rows="4" required
                placeholder="Elaborate deep technical architectural workflow metrics details..."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Problem Statement Matrix *</label>
              <textarea
                rows="3" required
                placeholder="What critical core ecosystem inefficiency are you identifying?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Proposed Solution Layout *</label>
              <textarea
                rows="3" required
                placeholder="Detail exactly how your architectural formulation resolves this friction..."
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-4 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
              >
                Publish New Concept Formulation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}