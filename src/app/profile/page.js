"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

function ProfileForm({ initialUser, onUserUpdate }) {
  const [name, setName] = useState(initialUser?.name || "");
  const [email] = useState(initialUser?.email || "");
  const [image, setImage] = useState(initialUser?.image || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim() || !image.trim()) {
      toast.error("Please fill out all identity profile fields.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await authClient.updateUser({
        name: name,
        image: image,
      });

      if (response && response.error) {
        throw new Error(response.error.message || "BetterAuth sync rejection.");
      }

      const sessionResponse = await authClient.getSession();
      if (sessionResponse?.data?.user) {
        onUserUpdate(sessionResponse.data.user);
      }

      toast.success("Profile tracking vectors updated successfully.");
    } catch (err) {
      toast.error(err.message || "An exception occurred during synchronization.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            {"Update Public Name"}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            {"Update Account Email"}
          </label>
          <input
            type="email"
            required
            disabled
            value={email}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          {"Update Identity Photo URL"}
        </label>
        <input
          type="url"
          required
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition duration-200 shadow-sm disabled:opacity-50"
        >
          {isUpdating ? "Saving Transformations..." : "Save Identity Changes"}
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { user, authLoading, setUser, logout } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/profile");
    }
  }, [user, authLoading, router]);

  const handleDisconnect = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 font-light">
        {"Verifying profile parameter maps..."}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md">
              <img
                src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 mb-1">
                {"Verified Innovator"}
              </span>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                {user.name || "Loading..."}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                {user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
          >
            {"Disconnect Session"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-6 rounded-2xl text-center">
            <p className="text-3xl font-black text-gray-900 dark:text-white">{"3"}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{"Deposited Concepts"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-6 rounded-2xl text-center">
            <p className="text-3xl font-black text-gray-900 dark:text-white">{"14"}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{"Peer Validations Issued"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-6 rounded-2xl text-center">
            <p className="text-3xl font-black text-gray-900 dark:text-white">{"A+"}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{"Ecosystem Credibility"}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 p-8 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-6">
            {"Profile Management"}
          </h3>
          
          <ProfileForm 
            key={user?.id || user?.email || "guest"} 
            initialUser={user} 
            onUserUpdate={setUser} 
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/60 bg-gray-100/50 dark:bg-gray-900/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              {"Your Guarded Repository"}
            </h3>
          </div>
          <div className="p-8 text-center text-sm text-gray-400 font-light italic">
            {"Dynamic tracking for personal startup records will synchronize seamlessly once MongoDB model routing channels open."}
          </div>
        </div>

      </div>
    </div>
  );
}