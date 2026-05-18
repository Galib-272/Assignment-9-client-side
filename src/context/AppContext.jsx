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
        return JSON.parse(storedUser);
      }
    }
    return null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    queueMicrotask(() => {
      setAuthLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${baseUrl}/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication sequence rejected.");
      }

      if (data.token) {
        const profileUser = { email };
        localStorage.setItem("vault-token", data.token);
        localStorage.setItem("vault-user", JSON.stringify(profileUser));
        setUser(profileUser);
        toast.success("Welcome back to the Vault workspace!");
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      toast.error(err.message || "Authentication sequence rejected.");
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
    <AppContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}
