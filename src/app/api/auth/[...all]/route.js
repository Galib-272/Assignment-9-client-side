import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// ✅ FIXED: Better Auth creates a specialized handler instance. 
// We destructure GET and POST directly from the instance to preserve 
// header context, cookies, and endpoint processing signatures.
export const { GET, POST } = toNextJsHandler(auth);