"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import LoginForm from "../../components/Authform/loginForm";
import RegisterForm from "../../components/Authform/registerForm";
import Login from "../../../public/auth/Login.svg";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

const AuthContent = () => {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const formParam = searchParams.get("form");
    setIsLogin(formParam !== "register");
  }, [searchParams]);

  const toggleForm = () => {
    const newFormType = isLogin ? "register" : "login";
    router.push(`/authentication?form=${newFormType}`);
    setIsLogin(!isLogin);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="absolute top-8 left-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
        >
          <IconArrowLeft className="mr-1" size={40} />
        </button>
      </div>
      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="text-start mb-6">
            <motion.h1
              key={isLogin ? "login-title" : "register-title"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex font-semibold items-center justify-start gap-4 text-4xl text-[#4E7BFF] montserrat-font-semibold "
            >
              {isLogin ? "Welcome Back" : "Create an Account"}
            </motion.h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <LoginForm toggleForm={toggleForm} />
              ) : (
                <RegisterForm toggleForm={toggleForm} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
        <Image
          src={Login}
          alt="Authentication Illustration"
          width={2000}
          height={2000}
          className="max-w-full max-h-full object-contain p-16"
        />
      </div>
    </div>
  );
};

const Authentication = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AuthContent />
  </Suspense>
);

export default Authentication;
