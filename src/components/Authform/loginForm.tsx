"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

interface LoginFormProps {
  toggleForm: () => void;
}

const LoginForm = ({ toggleForm }: LoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const response = await axios.post("/api/auth/login", { email, password });
  
      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token); // Store token
      router.push("/upload");
    } catch (error) {
      if(error instanceof Error){
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
          />
          {formErrors.email && (
            <p className="text-red-600 text-sm">{formErrors.email}</p>
          )}
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E7BFF]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {formErrors.password && (
            <p className="text-red-600 text-sm">{formErrors.password}</p>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#4E7BFF] hover:bg-[#4E7BFF]/90 text-white font-bold transition-all duration-200 focus:ring-2 focus:ring-[#121C42] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </form>

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#6E7C94]/30" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-[#6E7C94] font-bold">
            Or continue with
          </span>
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.div
          className="items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button className="inline-flex w-full justify-center rounded-2xl bg-gray-100 border border-[#6E7C94]/20 p-3 text-[#4E7BFF] hover:bg-[#4E7BFF]/10">
            
            <FaGoogle size={20} />
          </button>
        </motion.div>

        <motion.button
          type="button"
          onClick={toggleForm}
          className="w-full py-3 bg-[#121C42] text-white hover:bg-[#121C42]/90 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[#4E7BFF] focus:ring-offset-2 rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.95 }}
        >
          Don&#39;t have an Account? Sign Up
        </motion.button>
      </div>
    </div>
  );
};

export default LoginForm;
