"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser, authLoading } = useContext(AppContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const currentName =
    name || (user ? user.name || user.email.split("@")[0] : "");
  const currentImage =
    image ||
    (user
      ? user.image ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
      : "");

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login?redirectTo=/profile");
    }
  }, [user, authLoading, router, mounted]);

  const handleUpdateIdentity = (e) => {
    e.preventDefault();
    const finalName = name.trim() || currentName;
    const finalImage = image.trim() || currentImage;

    if (!finalName || !finalImage) {
      toast.error("Formulation parameters cannot be left blank.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = {
        ...user,
        name: finalName,
        image: finalImage,
      };

      localStorage.setItem("vault-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setName("");
      setImage("");
      toast.success("Identity changes saved successfully!");
    } catch (err) {
      toast.error("Ecosystem data sync error.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 font-light">
        Synchronizing credentials...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-8 rounded-2xl shadow-sm space-y-8">
          <div className="flex items-center space-x-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500 flex-shrink-0 bg-gray-100">
              <img
                src={
                  user.image ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                }
                alt="Identity Matrix View"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                }}
              />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded mb-1">
                Verified Innovator
              </span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {user.name || user.email.split("@")[0]}
              </h2>
              <p className="text-xs font-mono text-gray-400 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80 p-5 rounded-xl text-center">
              <span className="block text-2xl font-black text-gray-900 dark:text-white">
                3
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1 block">
                Deposited Concepts
              </span>
            </div>
            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80 p-5 rounded-xl text-center">
              <span className="block text-2xl font-black text-gray-900 dark:text-white">
                14
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1 block">
                Peer Validations Issued
              </span>
            </div>
            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80 p-5 rounded-xl text-center">
              <span className="block text-2xl font-black text-indigo-500 dark:text-indigo-400">
                A+
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1 block">
                Ecosystem Credibility
              </span>
            </div>
          </div>

          <form
            onSubmit={handleUpdateIdentity}
            className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Profile Management
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Update Public Name
                </label>
                <input
                  type="text"
                  placeholder={currentName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Update Account Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Update Identity Photo URL
              </label>
              <input
                type="url"
                placeholder={currentImage}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-sm"
              >
                {isSaving
                  ? "Saving Identity Changes..."
                  : "Save Identity Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
