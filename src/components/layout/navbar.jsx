"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const navItems = [
  { name: "Features", href: "#features", isSection: true },
  { name: "Steps", href: "#steps", isSection: true },
  { name: "Resources", href: "#resources", isSection: true },
];

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownTimer, setDropdownTimer] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/auth/getUser")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      router.push("/authentication");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToAuth = (isLogin) => {
    router.push(`/authentication?form=${isLogin ? "login" : "register"}`);
  };

  const handleNavigation = (e, item) => {
    e.preventDefault();
    const isHomePage = window.location.pathname === "/";
    if (isHomePage) {
      const section = document.querySelector(item.href);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${item.href}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center z-50 mt-6">
      <nav className="w-full max-w-6xl px-3 bg-white/30 backdrop-blur-md rounded-4xl shadow-2xl">
        <div className="max-w-7xl mx-auto ml-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link
              href="/"
              className="montserrat-font-medium text-3xl text-white"
            >
              Logo
            </Link>

            {/* Nav Items */}
            <div className="hidden md:flex items-center space-x-12 text-lg montserrat-font-medium">
              {navItems.map((item, index) => (
                <div key={index}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className="text-white hover:text-blue-200 transition duration-150 ease-in-out flex items-center"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Auth/Avatar */}
            <div className="hidden md:flex items-center gap-4 montserrat-font-medium ">
              {user ? (
                <div
                  className="relative group"
                  onMouseEnter={() => {
                    if (dropdownTimer) clearTimeout(dropdownTimer);
                    setOpenDropdown(true);
                  }}
                  onMouseLeave={() => {
                    const timer = setTimeout(() => setOpenDropdown(false), 300);
                    setDropdownTimer(timer);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer border-2 border-white text-xl">
                    {getInitials(user.firstName)}
                  </div>
                  {openDropdown && (
                    <div className="absolute -left-16  w-40 bg-white/30 backdrop-blur-3xl rounded-lg shadow-lg z-50 mt-6">
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="block w-full text-left px-4 py-2 cursor-pointer"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigateToAuth(false)}
                  className="px-4 py-2 text-md text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer montserrat-font-medium"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
