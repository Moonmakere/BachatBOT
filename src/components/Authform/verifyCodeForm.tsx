"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

const VerifyCodeForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/verify-code", { email, code });
      toast.success("Email verified! You can now log in.");
      router.push("/authentication?form=login");
    } catch (error) {
      toast.error("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      toast.error("Missing email. Please try again.");
      router.push("/authentication?form=register");
    }
  }, [email, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.h2
        className="text-2xl font-bold text-[#1A2251] text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Verify your Email
      </motion.h2>

      <motion.p
        className="text-[#6E7C94] text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        We have sent a code to <span className="font-medium">{email}</span>
      </motion.p>

      <motion.input
        type="text"
        name="code"
        placeholder="Enter verification code"
        value={code}
        onChange={handleChange}
        required
        maxLength={6}
        className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      />

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-2xl bg-[#4E7BFF] hover:bg-[#4E7BFF]/90 text-white font-bold transition-all duration-200 focus:ring-2 focus:ring-[#121C42] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </motion.button>
    </form>
  );
};

export default VerifyCodeForm;
