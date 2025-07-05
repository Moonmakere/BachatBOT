"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sideBarComponent";
import { CircleUser, House, Info, LogOut , UploadCloud , Calculator , ClipboardMinus   } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import LG from "../../../public/auth/Login.svg";

const SidebarComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/auth/getUser")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        router.push("/authentication");
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/authentication");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const Logo = () => (
    <Image
      alt="Logo"
      src={LG}
      width={70}
      height={70}
      className="px-1 mt-4 mb-10"
    />
  );

  const links = [
    {label: "Home", href: "/", icon:<House className="h-6 w-6 flex-shrink-0" />,  isBottom: false },
    { label: "Upload", href: "/upload", icon: <UploadCloud className="h-6 w-6 flex-shrink-0" />, isBottom: false },
    { label: "AI Tax-Calculator", href: "/dashboard", icon: <Calculator  className="h-6 w-6 flex-shrink-0" />, isBottom: false },
    { label: "Generate-Report", href: "/generateReport", icon: <ClipboardMinus  className="h-6 w-6 flex-shrink-0" />, isBottom: false },
    {label:"FAQs", href:"/faqs", icon:<Info className="h-6 w-6 flex-shrink-0" />, isBottom: false},
    { label: user?.firstName || "Profile", href: "/profile", icon: <CircleUser className="h-6 w-6 flex-shrink-0" />, isBottom: true },
    { label: "Logout", href: "", icon: <LogOut className="h-6 w-6 flex-shrink-0" />, isBottom: true, onClick: handleLogout },
  ];

  const isLinkActive = (href) => pathname === href;

  return (
    <Sidebar>
      <SidebarBody className="justify-between">
        <div className="flex h-full flex-col flex-1 overflow-y-auto overflow-x-hidden font-montserrat font-medium">
          <Logo />
          <div className="flex h-full flex-col">
            {/* Top Links */}
            <div className="flex flex-col gap-4">
              {links
                .filter((link) => !link.isBottom)
                .map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={`rounded-lg p-1.75 transition-colors duration-150 ${
                      isLinkActive(link.href)
                        ? "bg-blue-500 text-[#FFFFFF]"
                        : "text-[#0A153A] hover:bg-blue-500 hover:text-[#FFFFFF]"
                    }`}
                  />
                ))}
            </div>

            {/* Bottom Links */}
            <div className="mt-auto flex flex-col gap-4 mb-2">
              {links
                .filter((link) => link.isBottom)
                .map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={`rounded-lg p-1.75 transition-colors duration-150 ${
                      isLinkActive(link.href)
                        ? "bg-blue-500 text-[#FFFFFF]"
                        : "text-[#0A153A] hover:bg-blue-500 hover:text-[#FFFFFF]"
                    }`}
                    onClick={link.onClick}
                  />
                ))}
            </div>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default SidebarComponent;
