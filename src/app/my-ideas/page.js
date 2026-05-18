"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function MyIdeasPage() {
  const { user, authLoading } = useContext(AppContext);

  const router = useRouter();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purgingIdeaId, setPurgingIdeaId] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

  useEffect(() => {
    document.title = "IdeaVault | My Ideas";
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/my-ideas");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/ideas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load database records.");
        }

        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const userOwnedIdeas = data.filter(
            (item) =>
              (item.userEmail &&
                item.userEmail.toLowerCase() === user.email.toLowerCase()) ||
              (item.authorEmail &&
                item.authorEmail.toLowerCase() === user.email.toLowerCase()),
          );

          setIdeas(userOwnedIdeas);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const confirmPurgeExecution = () => {
    if (!purgingIdeaId) return;

    fetch(`http://localhost:5000/ideas/${purgingIdeaId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Purge operational failure.");
        }

        return res.json();
      })
      .then(() => {
        setIdeas((prev) => prev.filter((idea) => idea._id !== purgingIdeaId));

        setPurgingIdeaId(null);

        toast.success("Concept successfully purged from active nodes.");
      })
      .catch((err) => {
        console.error(err);

        setPurgingIdeaId(null);

        toast.error(
          err.message || "Unable to complete idea destruction sequence.",
        );
      });
  };

  const handleFormSubmitTrigger = (e) => {
    e.preventDefault();

    if (!editingIdea) return;

    setPendingUpdateData({ ...editingIdea });
  };

  const commitUpdateExecution = () => {
    if (!pendingUpdateData) return;

    fetch(`http://localhost:5000/ideas/${pendingUpdateData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vault-token")}`,
      },
      body: JSON.stringify(pendingUpdateData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to overwrite record nodes.");
        }

        return res.json();
      })
      .then(() => {
        setIdeas((prev) =>
          prev.map((item) =>
            item._id === pendingUpdateData._id ? pendingUpdateData : item,
          ),
        );

        setPendingUpdateData(null);
        setEditingIdea(null);

        toast.success("Startup concept configurations updated successfully!");
      })
      .catch((err) => {
        console.error(err);

        setPendingUpdateData(null);

        toast.error(err.message || "Matrix update synchronization failure.");
      });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 text-sm font-light">
        Decompressing personal concept matrix segments...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            My Deposited Concepts
          </h1>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal startup model records and validation
            parameters.
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/30 dark:bg-gray-950/20 max-w-xl mx-auto">
            <p className="text-sm text-gray-400 font-light italic mb-4">
              You haven{"'"}t uploaded any startup concept files into the system
              vault grid yet.
            </p>

            <Link
              href="/add-idea"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition duration-150 shadow-sm"
            >
              Deposit First Concept
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md h-full"
              >
                <div className="w-full h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800/40">
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

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight line-clamp-1">
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

                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/ideas/${idea._id}`}
                        className="text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] py-2.5 rounded-md transition duration-200 shadow-sm flex items-center justify-center"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => setEditingIdea({ ...idea })}
                        className="text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-2.5 rounded-md transition duration-200 shadow-sm"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => setPurgingIdeaId(idea._id)}
                        className="text-center bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] py-2.5 rounded-md transition duration-200 shadow-sm"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Update Formulation Data
            </h3>

            <form onSubmit={handleFormSubmitTrigger} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Concept Title
                </label>

                <input
                  type="text"
                  required
                  value={editingIdea.title || ""}
                  onChange={(e) =>
                    setEditingIdea({
                      ...editingIdea,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Short Description
                </label>

                <input
                  type="text"
                  required
                  value={editingIdea.shortDescription || ""}
                  onChange={(e) =>
                    setEditingIdea({
                      ...editingIdea,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Target Audience
                </label>

                <input
                  type="text"
                  required
                  value={editingIdea.targetAudience || ""}
                  onChange={(e) =>
                    setEditingIdea({
                      ...editingIdea,
                      targetAudience: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Estimated Budget
                </label>

                <input
                  type="text"
                  required
                  value={editingIdea.estimatedBudget || ""}
                  onChange={(e) =>
                    setEditingIdea({
                      ...editingIdea,
                      estimatedBudget: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingUpdateData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                Confirm Data Overwrite?
              </h3>

              <p className="text-xs font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                Are you sure you want to save these modifications? This will
                overwrite the existing formulation parameters inside the
                database cluster nodes.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPendingUpdateData(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={commitUpdateExecution}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}

      {purgingIdeaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                Purge System Node?
              </h3>

              <p className="text-xs font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                Are you absolutely sure you want to purge this concept from the
                repository? This destructive configuration cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPurgingIdeaId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmPurgeExecution}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors"
              >
                Purge Concept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
