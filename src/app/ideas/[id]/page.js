"use client";

import { useState, useEffect, use, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirectTo=/ideas/${params.id}`);
    }
  }, [user, authLoading, router, params.id, baseUrl]);

  useEffect(() => {
    if (!params.id) return;

    const pageMountTime = Date.now();

    Promise.all([
      fetch(`${baseUrl}/ideas/${params.id}`).then((res) => {
        if (!res.ok) throw new Error("Idea document not localized.");
        return res.json();
      }),
      fetch(`${baseUrl}/comments/${params.id}`).then((res) => {
        if (!res.ok) return [];
        return res.json();
      }),
    ])
      .then(([ideaData, commentsData]) => {
        if (ideaData && ideaData.title) {
          document.title = `IdeaVault | ${ideaData.title}`;
        }
        const networkElapsedTime = Date.now() - pageMountTime;
        const targetLoadingDelay = 1200;
        const remainingDelayGate = Math.max(
          0,
          targetLoadingDelay - networkElapsedTime,
        );

        setTimeout(() => {
          setIdea(ideaData);
          setComments(commentsData);
          setInitialLoading(false);
        }, remainingDelayGate);
      })
      .catch((err) => {
        console.error(err);
        setInitialLoading(false);
      });
  }, [params.id, baseUrl]);

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const commentPayload = {
      ideaId: params.id,
      text: newComment.trim(),
      userEmail: user.email,
      userName: user.name || "Anonymous Expert",
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
        if (!res.ok) throw new Error("Submission pipeline rejected.");
        return res.json();
      })
      .then((insertedRecord) => {
        const freshCommentObject = {
          _id: insertedRecord.insertedId,
          ...commentPayload,
          timestampRaw: new Date().toISOString(),
        };
        setComments((prev) => [freshCommentObject, ...prev]);
        setNewComment("");
        toast.success("Validation comment committed.");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleUpdateComment = (commentId) => {
    if (!editingText.trim()) return;

    fetch(`${baseUrl}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
      body: JSON.stringify({ text: editingText.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Modification parameters invalid.");
        return res.json();
      })
      .then(() => {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  text: editingText.trim(),
                  timestampRaw: new Date().toISOString(),
                }
              : c,
          ),
        );
        setEditingCommentId(null);
        setEditingText("");
        toast.success("Discussion point updated successfully.");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteComment = (commentId) => {
    fetch(`${baseUrl}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Deletion processing fault.");
        return res.json();
      })
      .then(() => {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.error("Discussion point detached from repository nodes.");
      })
      .catch((err) => toast.error(err.message));
  };

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
          Parsing detailed formula metrics...
        </p>
      </div>
    );
  }

  if (!user || !idea) return null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="rounded-2xl overflow-hidden h-[380px] relative bg-gray-100 border border-gray-100 dark:border-gray-800 shadow-sm">
          <img
            src={
              idea.image ||
              idea.imageURL ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
            }
            alt={idea.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-3">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
              {idea.category}
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {idea.title}
            </h1>
            <p className="text-gray-200 text-sm font-light max-w-2xl leading-relaxed">
              {idea.shortDescription}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/60 p-6 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Core Problem Statement
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                {idea.problemStatement}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/60 p-6 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Proposed Solution Layout
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                {idea.proposedSolution}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Detailed Technical Specifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed whitespace-pre-line">
                {idea.description}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/60 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-200/60 dark:border-gray-700/60 pb-3">
              Validation Vectors
            </h3>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Target Profile
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {idea.targetAudience}
              </span>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Estimated Budget Allocation
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {idea.estimatedBudget}
              </span>
            </div>

            {idea.tags && idea.tags.length > 0 && (
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Ecosystem Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {idea.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200/60 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-10 space-y-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Community Verification Board
            </h2>
            <p className="text-xs font-light text-gray-400 mt-0.5">
              Provide peer validation indicators or log adjustment metrics.
            </p>
          </div>

          <form
            onSubmit={handleCreateComment}
            className="flex gap-3 items-start"
          >
            <input
              type="text"
              required
              placeholder="Provide constructive formulation feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow px-4 py-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-sm h-full flex-shrink-0"
            >
              Log Feedback
            </button>
          </form>

          <div className="space-y-4 pt-2">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 font-light italic">
                No optimization discussion metrics logged against this
                repository node yet.
              </p>
            ) : (
              comments.map((comment) => {
                const isOwner =
                  user &&
                  user.email.toLowerCase() === comment.userEmail.toLowerCase();
                return (
                  <div
                    key={comment._id}
                    className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/40 p-4 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {comment.userName}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-200/50 dark:bg-gray-800 px-1.5 py-0.2 rounded">
                            {comment.userEmail}
                          </span>
                        </div>

                        {editingCommentId === comment._id ? (
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateComment(comment._id)}
                                className="bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm"
                              >
                                Commit
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

                      {isOwner && !editingCommentId && (
                        <div className="flex gap-2 flex-shrink-0 pt-0.5">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditingText(comment.text);
                            }}
                            className="text-[10px] font-bold text-amber-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-[10px] font-bold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
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
