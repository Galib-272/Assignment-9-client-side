"use client";

import { createContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export const AppContext = createContext(null);

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;

      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      return systemPrefersDark ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    async function synchronizeUserSession() {
      try {
        const sessionResponse = await authClient.getSession();
        const sessionData = sessionResponse?.data;

        if (sessionData?.user) {
          setUser(sessionData.user);

          const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const jwtResponse = await fetch(`${baseUrl}/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: sessionData.user.email }),
          });

          const tokenPayload = await jwtResponse.json();

          if (tokenPayload?.token) {
            localStorage.setItem("vault-token", tokenPayload.token);
          }
        } else {
          setUser(null);
          localStorage.removeItem("vault-token");
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    synchronizeUserSession();
  }, [theme]);

  const loginUser = async (email, password) => {
    setAuthLoading(true);

    try {
      const response = await authClient.signIn.email({ email, password });

      if (response?.error) {
        throw new Error(response.error.message);
      }

      const userData = response?.data?.user;

      if (userData) {
        setUser(userData);

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const jwtResponse = await fetch(`${baseUrl}/jwt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email }),
        });

        const tokenPayload = await jwtResponse.json();

        if (tokenPayload?.token) {
          localStorage.setItem("vault-token", tokenPayload.token);
        }

        toast.success("Credential metrics verified. Access granted.");
      }

      return { success: true };
    } catch (err) {
      toast.error(err.message || "Authentication sequence rejected.");
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);

    try {
      await authClient.signOut();
      setUser(null);
      localStorage.removeItem("vault-token");
      toast.error("Session terminated securely.");
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleTheme = () => {
    const targetTheme = theme === "dark" ? "light" : "dark";
    setTheme(targetTheme);
    localStorage.setItem("theme", targetTheme);

    if (targetTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        setUser,
        login: loginUser,
        logout,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
