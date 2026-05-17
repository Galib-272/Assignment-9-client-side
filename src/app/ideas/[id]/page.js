"use client";

import { useState, useEffect, use, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function IdeaDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { user } = useContext(AppContext);
  const router = useRouter();
  
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([
    {
      id: "c1",
      userName: "AJ",
      userPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      text: "This platform architecture could easily scale up. The proposed workflow makes clean logical sense.",
      timestamp: "May 16, 2026"
    },
    {
      id: "c2",
      userName: "Sarah K.",
      userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      text: "We need an integrated API bridge framework for data testing pipelines to verify conversion weights.",
      timestamp: "May 17, 2026"
    }
  ]);
  
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const foundIdea = data.find((item) => item._id === params.id);
        setIdea(foundIdea || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirectTo=/ideas/${params.id}`);
    }
  }, [user, loading, router, params.id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const freshComment = {
      id: `c_${Date.now()}`,
      userName: user?.displayName || user?.email?.split("@")[0] || "Contributer",
      userPhoto: user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      text: newComment,
      timestamp: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setComments((prev) => [freshComment, ...prev]);
    setNewComment("");
    toast.success("Comment added to validation thread!");
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    toast.error("Comment deleted from repository.");
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = (commentId) => {
    if (!editingText.trim()) return;
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, text: editingText } : c))
    );
    setEditingCommentId(null);
    setEditingText("");
    toast.success("Comment changes saved successfully!");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 font-light">
        Loading concept parameters...
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Concept Not Found</h2>
        <Link href="/ideas" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-md text-sm shadow-sm">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/ideas" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
            ← Back to Explore Dashboard
          </Link>
        </div>

        <div className="w-full h-64 md:h-96 overflow-hidden rounded-2xl relative bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 mb-8 shadow-sm">
          <img src={idea.image} alt={idea.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-3">
                {idea.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                {idea.title}
              </h1>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Core Concept Formulation</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed text-base">
                {idea.shortDescription} This technical arrangement bridges data parameters across verified processing routes to generate high-fidelity tracking panels. Testing mechanics prioritize user action logging cycles prior to opening full database connection sockets.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4 border-b border-gray-200/60 dark:border-gray-700/60 pb-2">
                Validation Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Target Demographics</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mt-0.5">{idea.targetAudience}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Estimated Launch Budget</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mt-0.5">{idea.estimatedBudget}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-6 rounded-2xl shadow-sm max-w-3xl">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Comments ({comments.length})
          </h3>

          <form onSubmit={handleAddComment} className="mb-8 space-y-3">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              required
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100/70 dark:border-gray-800/50"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {comment.userName}
                    </span>
                    <div className="flex items-center space-x-3">
                      {editingCommentId !== comment.id && (
                        <button
                          onClick={() => handleStartEdit(comment)}
                          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-1">
                    {editingCommentId === comment.id ? (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="bg-gray-200 text-gray-700 text-[11px] font-bold px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                        {comment.text}
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-400 font-light mt-1.5">
                    {comment.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}