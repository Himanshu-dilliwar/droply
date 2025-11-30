// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import connectDb from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        // Basic safety/casts
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // Connect DB and find user
        await connectDb();
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User does not exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,

    })
  ],

  // session options (top-level must be an object)
  session: {
    strategy: "jwt",
    // maxAge is seconds (10 days)
    maxAge: 10 * 24 * 60 * 60,
  },

  callbacks: {

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDb();

        let dbUser = await User.findOne({ email: user.email });

        // If user does NOT exist → create new user
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image, // profile picture from Google
            role: "user",      // default role (optional)
            password: "google-oauth" // required if schema expects password
          });
        }

        // Attach DB values back into next-auth user object
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }

      return true;
    },


    // run on sign-in to attach user props to token
    async jwt({ token, user }: { token: JWT & Record<string, any>; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    // return session to client
    async session({
      session,
      token,
    }: {
      session: Session & { user?: any };
      token: JWT & Record<string, any>;
    }): Promise<Session & { user?: any }> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ensure this is set in .env.local
  secret: process.env.AUTH_SECRET,
});
