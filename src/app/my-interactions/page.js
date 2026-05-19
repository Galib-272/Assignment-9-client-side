"use client";

import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://assignment-9-server-side.vercel.app" || "http://localhost:5000";

async function fetchMyComments(email, token) {
  // ✅ Try /my-comments first, fall back to /comments, then return []
  // Each attempt is independent so a failure doesn't crash the chain
  try {
    const res = await fetch(`${baseUrl}/my-comments?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (_) {}

  try {
    const res = await fetch(`${baseUrl}/comments?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (_) {}

  // Both failed — return empty instead of throwing
  return [];
}

export default function MyInteractionsPage() {
  const { user, authLoading } = useContext(AppContext);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "IdeaVault | My Interactions";
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;

    const token = localStorage.getItem("vault-token") || "";

    fetchMyComments(user.email, token)
      .then((comments) => {
        // ✅ Filter to only this user's comments if the endpoint returned all
        const mine = comments.filter((c) =>
          [c.userEmail, c.email, c.authorEmail].includes(user.email)
        );
        setInteractions(mine.length > 0 ? mine : comments);
      })
      .catch((err) => {
        console.error("Interaction fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, authLoading]);

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-light tracking-wide animate-pulse">
          Querying interactive comment vector sequences...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          View Restricted
        </h2>
        <Link
          href="/login?redirectTo=/my-interactions"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition duration-200"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-white min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          My Concept Interactions
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed">
          Review the peer validation comments and structural adjustment suggestions you have logged.
        </p>

        <div className="bg-white dark:bg-[#111726] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-8 shadow-md dark:shadow-xl w-full transition-colors duration-300">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-8">
            Commented Ideas Tracked ({interactions.length})
          </h3>

          {interactions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-[#131a2b]/30 border border-dashed border-gray-200 dark:border-gray-800/80 rounded-xl transition-colors duration-300">
              <p className="text-sm text-gray-400 font-light italic">
                No validation notes recorded across any concept repository blocks yet.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {interactions.map((comment, index) => {
                const uniqueKey = comment._id || comment.insertedId || `interaction-row-${index}`;
                const commentText = comment.text || comment.comment || comment.message || "";
                const targetIdeaId = comment.ideaId || comment.idea_id || comment.id || "";
                const ideaTitle =
                  comment.ideaTitle ||
                  comment.title ||
                  `Concept Analysis Map: ${targetIdeaId.substring(0, 8)}`;

                return (
                  <div key={uniqueKey} className="border-l-2 border-indigo-500 pl-5 space-y-2">
                    {targetIdeaId ? (
                      <Link
                        href={`/ideas/${targetIdeaId}`}
                        className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block tracking-tight transition-colors duration-200"
                      >
                        {ideaTitle}
                      </Link>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white block tracking-tight">
                        {ideaTitle}
                      </span>
                    )}

                    <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                      &ldquo;{commentText}&rdquo;
                    </p>

                    {(comment.timestampRaw || comment.timestamp || comment.date) && (
                      <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-mono pt-1">
                        Timestamp Logged:{" "}
                        {new Date(
                          comment.timestampRaw || comment.timestamp || comment.date
                        ).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}