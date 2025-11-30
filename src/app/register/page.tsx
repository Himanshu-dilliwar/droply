"use client";


import RegisterForm from "@/src/components/RegisterForm";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <RegisterForm />
      </motion.div>
    </div>
  );
}
