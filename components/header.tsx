"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
  <motion.div
    className="fixed inset-0 z-50 md:hidden"
    animate={isOpen ? "open" : "closed"}
    initial="closed"
    variants={{
      open: { opacity: 1, pointerEvents: "auto" },
      closed: { opacity: 0, pointerEvents: "none" },
    }}
  >
    {/* Backdrop */}
    <motion.div
      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      variants={{
        open: { opacity: 1 },
        closed: { opacity: 0 },
      }}
      onClick={onClose}
    />

    {/* Menu Content */}
    <motion.div
      className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-background border-l border-border"
      variants={{
        open: { x: "0%" },
        closed: { x: "100%" },
      }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        <nav className="flex flex-col gap-4">
          <Link
            href="/features"
            className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Features
          </Link>
          <hr className="border-border my-2" />
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="w-full" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </motion.div>
  </motion.div>
);

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            ✨ AstroHuff
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </nav>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
