"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser, logout } = useContext(AppContext);
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !photoURL.trim()) {
      toast.error("All dynamic profile settings fields must be populated.");
      return;
    }

    const updatedUser = {
      ...user,
      displayName: name,
      email: email,
      photoURL: photoURL,
    };

    setUser(updatedUser);
    toast.success("Profile repository credentials updated successfully!");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
          🔒
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
          Profile Locked
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-light mb-6 max-w-sm leading-relaxed text-sm">
          Please log into your registered contributor profile to view metric
          logs and concept history sheets.
        </p>
        <Link
          href="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-md text-sm transition-colors shadow-sm"
        >
          Sign In to Account
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 bg-gray-200 shadow-sm relative">
            <img
              src={
                user.photoURL ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
              }
              alt={user.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 mb-2">
              Verified Innovator
            </span>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {user.displayName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-0.5">
              {user.email}
            </p>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors border border-red-200/40 dark:border-red-900/40"
            >
              Disconnect Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900 dark:text-white">
              3
            </span>
            <span className="text-xs text-gray-400 font-light uppercase tracking-wider block mt-1">
              Deposited Concepts
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900 dark:text-white">
              14
            </span>
            <span className="text-xs text-gray-400 font-light uppercase tracking-wider block mt-1">
              Peer Validations Issued
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900 dark:text-white">
              A+
            </span>
            <span className="text-xs text-gray-400 font-light uppercase tracking-wider block mt-1">
              Ecosystem Credibility
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Profile Management
            </h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Update Public Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Update Account Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Update Identity Photo URL
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Save Identity Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Your Guarded Repository
            </h3>
          </div>
          <div className="p-6 text-center text-sm text-gray-400 font-light">
            Dynamic tracking for personal startup records will synchronize
            seamlessly once MongoDB model routing channels open.
          </div>
        </div>

      </div>
    </div>
  );
}