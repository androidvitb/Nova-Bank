"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import Cookies from 'js-cookie';
import { useAuth } from "../../context/authContext";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

import Image from "next/image";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const session = Cookies.get('session');
    if (session) setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = async () => {
    await fetch('/api/logout');
    Cookies.remove('session');
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleGetStartedClick = () => {
    router.push("/register");
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isRegister = pathname && pathname.startsWith("/register");
  const isLogin = pathname && pathname.startsWith("/login");

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b z-50 py-4 px-4 lg:px-16 transition-colors duration-300",
      (isLogin || isRegister) && "hidden"
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <Image src="/logo_heading.png" alt="logo_heading" width={64} height={24} className="dark:invert" />
        </div>
        
        <div className="hidden lg:flex gap-8 text-sm font-medium text-muted-foreground">
          {isLoggedIn && (
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          )}
          <button className="hover:text-foreground transition-colors" onClick={() => handleScrollToSection("solution-section")}>Solution</button>
          <button className="hover:text-foreground transition-colors" onClick={() => handleScrollToSection("resources-section")}>Resources</button>
          <button className="hover:text-foreground transition-colors" onClick={() => handleScrollToSection("result-section")}>Results</button>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>

        <div className="hidden lg:flex gap-4 items-center">
          <ThemeToggle />
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={handleLoginClick}>Log in</Button>
              <Button onClick={handleGetStartedClick} className="rounded-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleLogoutClick} className="rounded-full">
              Logout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-3/4 h-full bg-background border-r shadow-xl z-50 p-8 lg:hidden flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="logo" width={32} height={32} />
                <Image src="/logo_heading.png" alt="logo_heading" width={64} height={24} className="dark:invert" />
              </div>

              <div className="flex flex-col gap-4">
                {isLoggedIn && (
                  <Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>Dashboard</Link>
                )}
                <button className="text-left text-lg font-medium hover:text-primary transition-colors" onClick={() => { handleScrollToSection("solution-section"); toggleMenu(); }}>Solution</button>
                <button className="text-left text-lg font-medium hover:text-primary transition-colors" onClick={() => { handleScrollToSection("resources-section"); toggleMenu(); }}>Resources</button>
                <button className="text-left text-lg font-medium hover:text-primary transition-colors" onClick={() => { handleScrollToSection("result-section"); toggleMenu(); }}>Results</button>
                <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors" onClick={toggleMenu}>Contact</Link>
              </div>

              <hr className="my-2" />

              <div className="flex flex-col gap-4">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" className="justify-start text-lg h-auto py-2 px-0" onClick={handleLoginClick}>Log in</Button>
                    <Button onClick={handleGetStartedClick} className="w-full text-lg h-auto py-3 rounded-full">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full text-lg h-auto py-3 rounded-full" onClick={handleLogoutClick}>
                    Logout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
