"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password) {
      return setErrorMsg("All fields are required.");
    }

    if (password.length < 6) {
      return setErrorMsg("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Account created! Redirecting...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setErrorMsg("Something went wrong.");
    }

    setLoading(false);
  };
   const handleGoogleSignIn = async () => {
      setLoading(true);
      // This will redirect to Google and then back via NextAuth's callbacks
      await signIn("google", { callbackUrl: "/" });
      // If you want to not redirect immediately, you can pass redirect:false and handle response
      setLoading(false);
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Create your account
      </h2>

      <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
        Sign up to continue
      </p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            placeholder="Enter Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
              border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 
              outline-none text-gray-900 dark:text-gray-100
            "
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
              border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 
              outline-none text-gray-900 dark:text-gray-100
            "
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="text-sm text-gray-600 dark:text-gray-300">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
              border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 
              outline-none text-gray-900 dark:text-gray-100 pr-10
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 bottom-2 text-gray-600 dark:text-gray-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        {/* Success */}
        {successMsg && (
          <p className="text-sm text-green-600">{successMsg}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 mt-2 rounded-full bg-red-600 
            hover:bg-red-700 text-white font-semibold
            disabled:opacity-60
          "
        >
          {loading ? "Creating..." : "Sign Up"}
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


        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-red-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </motion.div>
  );
}
