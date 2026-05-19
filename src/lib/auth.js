import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("ideaVaultDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  emailAndPassword: {
    enabled: true,
    // ✅ FIXED: Overrides the server-side default from 8 to 6 characters
    minPasswordLength: 6, 
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
});