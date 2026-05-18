import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017",
);
const db = client.db("ideaVaultDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "temporary_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temporary_secret",
    },
  },

  secret:
    process.env.BETTER_AUTH_SECRET ||
    "super_secret_cryptographic_vault_key_hash_2026",
});
