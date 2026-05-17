"use client";

import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MyIdeasPage() {
  const { user } = useContext(AppContext);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          View Restricted
        </h2>
        <Link
          href="/login"
          className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-md text-sm shadow-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          My Ideas
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-8">
          Manage and track validations for concept formulas you introduced into
          the ecosystem repository.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              Education Module
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mt-1">
              EduPulse AI
            </h3>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-0.5">
              Automated metrics tracking for student progress.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsUpdateOpen(true)}
              className="flex-1 sm:flex-none text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
            >
              Update
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="flex-1 sm:flex-none text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>

        {isUpdateOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Update Concept Formula
              </h3>
              <p className="text-xs text-gray-400 font-light mb-4">
                Modify entry properties stored inside the centralized validation
                index sheets.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsUpdateOpen(false)}
                  className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsUpdateOpen(false);
                    toast.success("Concept successfully updated!");
                  }}
                  className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                Confirm Complete Erasure
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-6 leading-relaxed">
                Are you certain you wish to completely wipe this startup
                formulation from the directory index logs? This calculation
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsDeleteOpen(false);
                    toast.error("Concept wiped from repository.");
                  }}
                  className="text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-md shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
