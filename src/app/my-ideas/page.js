"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://assignment-9-server-side.vercel.app" || "http://localhost:5000";

export default function MyIdeasPage() {
  const { user, authLoading } = useContext(AppContext);
  const router = useRouter();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [editingIdea, setEditingIdea] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Tech");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editAudience, setEditAudience] = useState("");
  const [editImage, setEditImage] = useState("");

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deletingIdeaId, setDeletingIdeaId] = useState(null);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) {
        setMounted(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login?redirectTo=/my-ideas");
    }
  }, [user, authLoading, router, mounted]);

  useEffect(() => {
    if (!mounted || !user?.email) return;

    let active = true;

    requestAnimationFrame(() => {
      if (active) {
        setLoading(true);
      }
    });

    const token = localStorage.getItem("vault-token") || localStorage.getItem("token");
    const targetEmail = user.email.toLowerCase();

    fetch(`${baseUrl}/ideas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve rows.");
        return res.json();
      })
      .then((data) => {
        if (active) {
          const rawData = Array.isArray(data) ? data : [];
          
          const userSpecificData = rawData.filter((item) => {
            const itemEmail = (item.email || item.userEmail || item.authorEmail || "").toLowerCase();
            return itemEmail === targetEmail && itemEmail !== "";
          });

          setIdeas(userSpecificData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch failure:", err);
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user?.email, mounted]);

  const confirmDeleteIdea = () => {
    if (!deletingIdeaId) return;

    const token = localStorage.getItem("vault-token") || localStorage.getItem("token");

    fetch(`${baseUrl}/ideas/${deletingIdeaId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Operational sequence rejected.");
        return res.json();
      })
      .then(() => {
        setIdeas((prev) => prev.filter((idea) => {
          const targetId = idea._id || idea.id;
          return targetId !== deletingIdeaId;
        }));
        setDeletingIdeaId(null);
        toast.error("Concept permanently deleted from ledger.");
      })
      .catch((err) => {
        toast.error(`Purge sequence failure: ${err.message}`);
        setDeletingIdeaId(null);
      });
  };

  const handleOpenEdit = (idea) => {
    setEditingIdea(idea);
    setEditTitle(idea.title || "");
    setEditCategory(idea.category || "Tech");
    setEditShortDescription(idea.shortDescription || idea.description || "");
    setEditBudget(idea.estimatedBudget || idea.budget || "");
    setEditAudience(idea.targetAudience || idea.audience || "");
    setEditImage(idea.image || "");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const executeSaveEdit = () => {
    if (!editingIdea) return;

    const token = localStorage.getItem("vault-token") || localStorage.getItem("token");
    const targetId = editingIdea._id || editingIdea.id;

    const updatePayload = {
      title: editTitle,
      category: editCategory,
      shortDescription: editShortDescription,
      estimatedBudget: editBudget,
      targetAudience: editAudience,
      image: editImage,
    };

    fetch(`${baseUrl}/ideas/${targetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatePayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Modification sequence failed.");
        return res.json();
      })
      .then(() => {
        setIdeas((prev) =>
          prev.map((idea) => {
            const currentId = idea._id || idea.id;
            return currentId === targetId ? { ...idea, ...updatePayload } : idea;
          })
        );
        setEditingIdea(null);
        setShowConfirmationModal(false);
        toast.success("Concept blueprint saved successfully!");
      })
      .catch((err) => {
        console.error(err);
        setShowConfirmationModal(false);
        toast.error("Unable to patch target cluster values.");
      });
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-light tracking-wide animate-pulse">
          Synchronizing credentials...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-[#0b0f19] dark:text-white min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              My Deposited Concepts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-2">
              Manage and analyze the architectural records you have committed to the matrix.
            </p>
          </div>
          <Link
            href="/add-idea"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20"
          >
            Deposit New Formula
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light tracking-wide animate-pulse">
              Querying database document vectors...
            </p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#111726]/40 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl transition-colors duration-300">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light italic mb-4">
              You have not registered any concept parameters under this identity signature.
            </p>
            <Link
              href="/add-idea"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Commit your first formula →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea, index) => {
              const currentId = idea._id || idea.id || `my-idea-card-${index}`;

              return (
                <div
                  key={currentId}
                  className="bg-white border border-gray-200 dark:bg-[#111726] dark:border-gray-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md dark:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    <div className="w-full h-48 overflow-hidden relative bg-gray-100 dark:bg-[#090d16]">
                      <img
                        src={idea.image}
                        alt={idea.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
                        }}
                      />
                      <span className="absolute top-4 right-4 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-md text-indigo-600 dark:text-indigo-400 shadow-sm uppercase tracking-wider border border-gray-200 dark:border-gray-800/40">
                        {idea.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight line-clamp-1 mb-2">
                        {idea.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light line-clamp-3 leading-relaxed">
                        {idea.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-800/60 flex items-center justify-between bg-gray-50/80 dark:bg-[#131a2b]/40">
                    {idea._id || idea.id ? (
                      <Link
                        href={`/ideas/${idea._id || idea.id}`}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View Analysis
                      </Link>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">View Unavailable</span>
                    )}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleOpenEdit(idea)}
                        className="text-xs font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingIdeaId(idea._id || idea.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingIdea && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 dark:bg-[#111726] dark:border-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8 transition-colors duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Modify Concept Formulation
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-1">
                Adjust your active registry parameters inline without leaving the view loop.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Concept Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-[#151c2c] dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Ecosystem Sector
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-[#151c2c] dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Health">Health</option>
                    <option value="AI">AI</option>
                    <option value="Education">Education</option>
                    <option value="FinTech">FinTech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Summary Blueprint Formulation
                </label>
                <textarea
                  rows="3"
                  required
                  value={editShortDescription}
                  onChange={(e) => setEditShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-[#151c2c] dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Venture Launch Budget
                  </label>
                  <input
                    type="text"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-[#151c2c] dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Target Audience Demographic
                  </label>
                  <input
                    type="text"
                    required
                    value={editAudience}
                    onChange={(e) => setEditAudience(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-[#151c2c] dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Cover Vector Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-[#151c2c] dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-gray-800/60">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 dark:bg-[#111726] dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center transition-colors duration-300">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Confirm Structural Modifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-6">
              Are you sure you want to commit these architectural modifications to the database cluster records?
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={executeSaveEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingIdeaId && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 dark:bg-[#111726] dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center transition-colors duration-300">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Confirm Purge Sequence
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-6">
              Are you sure you want to permanently delete this concept blueprint from the repository? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setDeletingIdeaId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteIdea}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-red-600/20"
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}