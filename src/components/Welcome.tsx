"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/register");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 
      bg-linear-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black 
      text-gray-900 dark:text-gray-100 transition-all">

      {/* --- Animated Logo Reveal --- */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="w-28 h-28 rounded-full border-4 border-red-500 flex items-center justify-center overflow-hidden shadow-xl">
          {/* Replace with your real logo */}
          <img
            src="/logo.png"
            alt="Droplu logo"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* --- Animated Title --- */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-red-600 tracking-wide drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        DROPLY
      </motion.h1>

      {/* --- Description with shimmer --- */}
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl relative shimmer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3, delay: 0.3 }}
      >
        Superfast delivery of groceries & everyday essentials.  
        Convenience reinvented — arriving in minutes.
      </motion.p>

      {/* --- Slide-to-start Animation --- */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.6 }}
        className="mt-12"
      >
        <Link
          href="/register"
          className="px-10 py-4 bg-red-600 hover:bg-red-700 active:scale-95 
                     transition rounded-full text-white font-semibold text-lg 
                     shadow-xl backdrop-blur-md"
        >
          Start →
        </Link>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Redirecting to login...
      </p>

      </motion.div>

     
      
      {/* --- CSS for shimmer effect --- */}
      <style>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          height: 100%;
          width: 150%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: shimmerMove 2s infinite;
        }
        @keyframes shimmerMove {
          0% { left: -150%; }
          100% { left: 150%; }
        }
      `}</style>
    </div>
  );
}
