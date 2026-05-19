"use client";

import { useState, useEffect, use, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

// Prioritize environment variables, then fall back to standard local host execution cleanly
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function IdeaDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { user, authLoading } = useContext(AppContext);
  const router = useRouter();

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirectTo=/ideas/${params.id}`);
    }
  }, [user, authLoading, router, params.id]);

  useEffect(() => {
    if (!params.id) return;

    const pageMountTime = Date.now();

    Promise.all([
      // ✅ FIXED: Catch failure inline inside the promise map to prevent breaking execution
      fetch(`${baseUrl}/ideas/${params.id}`)
        .then((res) => {
          if (!res.ok) return { message: "Idea document not localized." };
          return res.json();
        })
        .catch(() => ({ message: "Idea document not localized." })),
        
      fetch(`${baseUrl}/comments?ideaId=${params.id}`)
        .then((res) => {
          if (!res.ok) return [];
          return res.json();
        })
        .catch(() => []),
    ])
      .then(([ideaData, commentsData]) => {
        const networkElapsedTime = Date.now() - pageMountTime;
        const targetLoadingDelay = 1500;
        const remainingDelayGate = Math.max(
          0,
          targetLoadingDelay - networkElapsedTime,
        );

        setTimeout(() => {
          setIdea(ideaData);
          setComments(Array.isArray(commentsData) ? commentsData : []);
          setInitialLoading(false);
        }, remainingDelayGate);
      })
      .catch((err) => {
        console.error("Data handshake failure:", err);
        setInitialLoading(false);
      });
  }, [params.id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      toast.error("Please log in to participate in peer validation.");
      return;
    }

    const commentPayload = {
      ideaId: params.id,
      text: newComment,
      userEmail: user.email,
      userName:
        user.name ||
        user.displayName ||
        user.email.split("@")[0] ||
        "Anonymous Peer",
      authorImage:
        user.image ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      timestampRaw: new Date().toISOString(),
    };

    fetch(`${baseUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
      body: JSON.stringify(commentPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized submission.");
        return res.json();
      })
      .then((savedComment) => {
        const commentWithKey = {
          ...commentPayload,
          ...savedComment,
          _id:
            savedComment.insertedId ||
            savedComment._id ||
            Date.now().toString(),
        };

        setComments((prev) => [commentWithKey, ...prev]);
        setNewComment("");
        toast.success("Comment added to validation thread!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Authentication expired or invalid payload.");
      });
  };

  const handleDeleteComment = (commentId) => {
    fetch(`${baseUrl}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Forbidden operational sequence.");
        return res.json();
      })
      .then(() => {
        setComments((prev) =>
          prev.filter((c) => {
            const currentId = c._id || c.insertedId;
            return currentId !== commentId;
          }),
        );
        toast.error("Comment deleted from repository.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("You can only delete your own comment records.");
      });
  };

  const handleStartEdit = (comment) => {
    const targetId = comment._id || comment.insertedId;
    setEditingCommentId(targetId);
    setEditingText(comment.text);
  };

  const handleSaveEdit = (commentId) => {
    if (!editingText.trim()) return;

    fetch(`${baseUrl}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
      body: JSON.stringify({ text: editingText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failure.");
        return res.json();
      })
      .then(() => {
        setComments((prev) =>
          prev.map((c) => {
            const currentId = c._id || c.insertedId;
            return currentId === commentId ? { ...c, text: editingText } : c;
          }),
        );

        setEditingCommentId(null);
        setEditingText("");
        toast.success("Comment changes saved successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Unable to update comment resource parameters.");
      });
  };

  if (authLoading || initialLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
          Querying database document vectors...
        </p>
      </div>
    );
  }

  if (!idea || idea.message) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Concept Not Found
        </h2>

        <Link
          href="/ideas"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-md text-sm shadow-sm"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/ideas"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            ← Back to Explore Dashboard
          </Link>
        </div>

        <div className="w-full h-64 md:h-96 overflow-hidden rounded-2xl relative bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 mb-8 shadow-sm">
          <img
            src={idea.image}
            alt={idea.title}
            className="w-full h-full object-cover"
          />
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Core Concept Formulation
              </h3>

              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed text-base">
                {idea.shortDescription}
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
                  <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Target Demographics
                  </span>

                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mt-0.5">
                    {idea.targetAudience}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Estimated Launch Budget
                  </span>

                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mt-0.5">
                    {idea.estimatedBudget}
                  </span>
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
              placeholder="Add your verification comment..."
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
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 font-light italic">
                No validation notes recorded on this module yet.
              </p>
            ) : (
              comments.map((comment, index) => {
                const uniqueKey =
                  comment._id || comment.insertedId || `fallback-key-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100/70 dark:border-gray-800/50"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:bg-gray-700">
                      <img
                        src={
                          comment.authorImage ||
                          comment.authorPhoto ||
                          comment.userPhoto ||
                          comment.image ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                        }
                        alt={comment.userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {comment.userName}
                          </span>

                          <span className="text-[10px] text-gray-400 font-light">
                            {comment.userEmail}
                          </span>
                        </div>

                        {user && user.email === comment.userEmail && (
                          <div className="flex items-center space-x-3">
                            {editingCommentId !== uniqueKey && (
                              <button
                                onClick={() => handleStartEdit(comment)}
                                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteComment(uniqueKey)}
                              className="text-xs font-medium text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        {editingCommentId === uniqueKey ? (
                          <div className="mt-2 space-y-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(uniqueKey)}
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
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                              {comment.text}
                            </p>

                            {(comment.timestampRaw || comment.timestamp) && (
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-light">
                                {new Date(
                                  comment.timestampRaw || comment.timestamp,
                                ).toLocaleString(undefined, {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}