// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  // If already signed-in, redirect (optional)
  // if (session) {
  //   // small client-side redirect to dashboard/home
  //   console.log(session)
  //   router.push("/");
  //   return null;
  // }

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    // signIn with credentials provider; pass redirect: false to handle result
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    // res could be undefined in rare cases; guard it
    if (!res) {
      setError("Unexpected error. Try again.");
      return;
    }

    // next-auth returns error string in res.error
    if (res.error) {
      setError(res.error || "Invalid credentials");
      return;
    }

    // success — redirect to dashboard or home
    router.push("/");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    // This will redirect to Google and then back via NextAuth's callbacks
    await signIn("google", { callbackUrl: "/" });
    // If you want to not redirect immediately, you can pass redirect:false and handle response
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue to DROPLY</p>
        </div>

        

        {/* Credentials form */}
        <form onSubmit={handleCredentialsLogin} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm text-gray-900 dark:text-gray-100 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 bottom-3 text-gray-600 dark:text-gray-300"
              aria-label="toggle password"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">or</span>
            <span className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Google button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-sm transition text-sm"
          >
            <FcGoogle size={18} />
            <span className="font-medium">Continue with Google</span>
          </button>

          
        </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-red-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </form>
        
      </motion.div>
    </div>
  );
}
