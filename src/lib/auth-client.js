import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // Dynamically uses the exact domain name currently loading in the address bar
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
});