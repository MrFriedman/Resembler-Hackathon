"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import logo from '@/public/logo.svg';
import Image from "next/image";
import { isDemoMode } from "@/lib/demo";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const demo = isDemoMode();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Hide links on these pages
  const hideNavLinks = ["/", "/register", "/login", "/accountsetup"].includes(pathname);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src={logo} alt="ActiveGuard Logo" width={60} height={60} />
          <h2 className="text-2xl font-bold tracking-wide text-cyan-400">
            ActiveGuard
          </h2>
          {session?.user?.name && (
            <span className="ml-3 hidden text-xs text-gray-400 sm:inline">
              {session.user.name}
              {demo ? " · demo" : ""}
            </span>
          )}
        </div>

        {/* Hamburger Menu for Small Screens */}
        {!hideNavLinks && (
          <button
            className="md:hidden text-white focus:outline-none pr-5"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
          </button>
        )}

        {/* Horizontal Menu for Larger Screens */}
        {!hideNavLinks && (
          <div className="hidden md:flex gap-6">
            <NavLinks />
          </div>
        )}
      </div>

      {/* Dropdown Menu (Small Screens) */}
      {isOpen && !hideNavLinks && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-4 animate-fade-in">
          <NavLinks />
        </div>
      )}
    </nav>
  );
}

const links = {
  Home: "/dashboard",
  "Manage Account": "/account",
  Notifications: "/notifications",
};

const NavLinks = () => (
  <div className="flex flex-col md:flex-row items-center gap-4">
    {Object.entries(links).map(([label, href]) => (
      <Link
        key={label}
        href={href}
        className="w-40 flex justify-center bg-gray-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {label}
      </Link>
    ))}
  </div>
);

export default Menu;
