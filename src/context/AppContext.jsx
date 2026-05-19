"use client";

import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("vault-user");
      const storedToken = localStorage.getItem("vault-token");
      if (storedUser && storedToken) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://assignment-9-server-side.vercel.app" ||
    "http://localhost:5000";

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${baseUrl}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication sequence rejected.");
      }

      if (data.token) {
        localStorage.setItem("vault-token", data.token);

        const verifiedUser = data.user || {
          email,
          name: email.split("@")[0],
          image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        };

        localStorage.setItem("vault-user", JSON.stringify(verifiedUser));
        setUser(verifiedUser);
        toast.success("Welcome back to the Vault workspace!");
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      toast.error(err.message || "Authentication sequence rejected.");
      return { success: false };
    }
  };

  const loginWithGoogle = async (email, userData = {}) => {
    try {
      const response = await fetch(`${baseUrl}/jwt/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google authentication failed.");
      }

      if (data.token) {
        localStorage.setItem("vault-token", data.token);

        const verifiedUser = data.user || {
          email,
          name: userData.name || email.split("@")[0],
          image:
            userData.image ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        };

        // Prefer the richer data from Google over what's in the DB
        const mergedUser = {
          ...verifiedUser,
          name: userData.name || verifiedUser.name,
          image: userData.image || verifiedUser.image,
        };

        localStorage.setItem("vault-user", JSON.stringify(mergedUser));
        setUser(mergedUser);
        toast.success("Welcome to the Vault workspace!");
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      toast.error(err.message || "Google authentication failed.");
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("vault-token");
    localStorage.removeItem("vault-user");
    setUser(null);
    toast.success("Session disconnected successfully.");
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, authLoading, login, loginWithGoogle, logout, theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}