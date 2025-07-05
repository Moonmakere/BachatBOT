"use client";

import { cn } from "../../lib/utils";
import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "../../hooks/useSidebar";
import { IconMenu2, IconX } from "@tabler/icons-react";

// Single sidebar link component
export const SidebarLink = ({ link, className, onClick, ...props }) => {
  const { open, animate } = useSidebar();

  const handleClick = (e) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group py-2 transition-colors duration-150",
        "rounded-lg p-2 hover:bg-blue-500 hover:text-white montserrat-font-medium text-lg",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="group-hover:text-white transition-colors duration-150">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm whitespace-pre inline-block !p-0 !m-0 transition-colors duration-150 group-hover:text-white"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

// Desktop sidebar component
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-4 bg-gray-200 flex-shrink-0 rounded-r-4xl sticky top-0",
        className
      )}
      animate={{
        width: animate ? (open ? "250px" : "70px") : "250px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};


// Main sidebar wrapper
export const Sidebar = ({ children }) => {
  return <>{children}</>;
};
