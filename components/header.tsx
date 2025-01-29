"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userEmail?: string | null;
  userName?: string | null;
  userPhotoURL?: string | null;
  onSignOut: () => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  userEmail,
  userName,
  userPhotoURL,
  onSignOut,
}: MobileMenuProps) => (
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
          {!isAuthenticated && (
            <Link
              href="/features"
              className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Features
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 py-2">
                <Avatar>
                  <AvatarImage src={userPhotoURL || undefined} />
                  <AvatarFallback>
                    {userName
                      ? userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : userEmail?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  {userName && (
                    <span className="text-sm font-medium">{userName}</span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
              <hr className="border-border my-2" />
              <Link
                href="/dashboard"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Edit Profile
              </Link>
              <Button variant="destructive" onClick={onSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <hr className="border-border my-2" />
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </motion.div>
  </motion.div>
);

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />

        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-semibold">
            <span className="text-foreground">✨</span>{" "}
            <span className="text-foreground">AstroHuff</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <Link
                href="/features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
            )}
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 p-1 px-2 hover:bg-white/10"
                    >
                      <span className="text-sm font-medium hidden sm:inline-block">
                        {user.displayName || "Account"}
                      </span>
                      <Avatar>
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback className="bg-cosmic-purple/10 text-cosmic-purple">
                          {user.displayName
                            ? getInitials(user.displayName)
                            : user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-500"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-cosmic-purple hover:bg-cosmic-purple/90"
                  asChild
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-white/10"
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
        isAuthenticated={!!user}
        userEmail={user?.email}
        userName={user?.displayName}
        userPhotoURL={user?.photoURL}
        onSignOut={handleSignOut}
      />
    </>
  );
};
