"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

interface RegisterFormProps {
  toggleForm: () => void;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm = ({ toggleForm }: RegisterFormProps) => {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await axios.post("/api/auth/register", user);
      toast.success("Account created!");
      router.push("/authentication?form=login");
    } catch (error) {
      if(error instanceof Error){
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-4 text-[#1A2251]">
      <form onSubmit={handleSubmit} className="space-y-3">
        <motion.div
          className="grid grid-cols-2 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={user.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={user.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
          />
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your Password"
            value={user.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-[#6E7C94]/20 focus:border-[#4E7BFF] focus:outline-none font-bold text-[#121C42] placeholder-[#6E7C94]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E7BFF]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#4E7BFF] hover:bg-[#4E7BFF]/90 text-white font-bold transition-all duration-200 focus:ring-2 focus:ring-[#121C42] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </motion.button>
      </form>

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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
          className="flex gap-2 items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button className="inline-flex w-full justify-center rounded-2xl bg-gray-100 border border-[#6E7C94]/20 p-3 text-[#4E7BFF] hover:bg-[#4E7BFF]/10">
            <FaGoogle size={20} />
          </button>
        </motion.div>

        <motion.button
          type="button"
          onClick={toggleForm}
          className="w-full py-3 rounded-2xl bg-[#121C42] text-white hover:bg-[#121C42]/90 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[#4E7BFF] focus:ring-offset-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.95 }}
        >
          Already have an account? Log In
        </motion.button>
      </div>
    </div>
  );
};

export default RegisterForm;
