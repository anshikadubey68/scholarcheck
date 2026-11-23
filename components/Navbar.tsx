"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authClient, useSession } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  Sparkles,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user: UserInfo | null = session?.user
    ? { id: session.user.id, name: session.user.name, email: session.user.email }
    : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    try {
      await authClient.signOut();
    } catch {
      // Fallback to logout endpoint if needed
      await fetch("/api/auth/logout", { method: "POST" });
    }
    window.location.href = "/login";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const closeMobile = () => setMobileMenuOpen(false);

  const isActive = (path: string) => {
    if (path !== "/" && pathname.startsWith(path)) return true;
    if (path === "/" && pathname === "/") return true;
    return false;
  };

  return (
    <header className="site-head" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="site-head-container">
        {/* Leftmost Section: Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center", justifySelf: "start" }}>
          <Link
            href={user ? "/check" : "/"}
            className="brand"
            onClick={closeMobile}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.25rem" }}
          >
            <span style={{ fontSize: "1.4rem" }}>🛡️</span>
            <span>ScholarCheck</span>
          </Link>
        </div>

        {/* Middle Section: Centered Navigation Links (only when logged in) */}
        {user ? (
          <nav
            className="desktop-nav"
            aria-label="Main"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}
          >
            <Link
              href="/check"
              prefetch={true}
              style={{
                color: isActive("/check") ? "var(--ink)" : "var(--muted)",
                fontWeight: isActive("/check") ? 700 : 600,
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.15s ease",
              }}
            >
              Check an Offer
            </Link>
            <Link
              href="/directory"
              prefetch={true}
              style={{
                color: isActive("/directory") ? "var(--ink)" : "var(--muted)",
                fontWeight: isActive("/directory") ? 700 : 600,
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.15s ease",
              }}
            >
              Directory
            </Link>
            <Link
              href="/find-scholarships"
              prefetch={true}
              style={{
                color: isActive("/find-scholarships") ? "var(--ink)" : "var(--muted)",
                fontWeight: isActive("/find-scholarships") ? 700 : 600,
                textDecoration: "none",
                fontSize: "0.95rem",
                transition: "color 0.15s ease",
              }}
            >
              Find Scholarships
            </Link>
          </nav>
        ) : (
          <nav
            className="desktop-nav"
            aria-label="Main"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          />
        )}

        {/* Rightmost Section: Theme Toggle + Auth / Profile */}
        <div
          className="desktop-actions"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 14,
            justifySelf: "end",
          }}
        >
          <ThemeToggle />

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="desktop-user-pill flex items-center gap-2 rounded-full border border-line bg-card py-1 pl-1.5 pr-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <Avatar size="sm" className="size-6">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name.split(" ")[0]}</span>
                <ChevronDown className={`size-3 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-line bg-card p-2 text-foreground shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                  {/* User Info Header */}
                  <div className="px-2.5 py-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-foreground truncate max-w-[160px]">
                        {user.name}
                      </p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        Student
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <Separator className="my-1.5" />

                  {/* Navigation Links */}
                  <div className="space-y-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-muted transition-colors text-foreground"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      <span>Student Dashboard</span>
                    </Link>

                    <Link
                      href="/check"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-muted transition-colors text-foreground"
                    >
                      <ShieldCheck className="size-4 text-muted-foreground" />
                      <span>Check an Offer</span>
                    </Link>

                    <Link
                      href="/directory"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-muted transition-colors text-foreground"
                    >
                      <BookOpen className="size-4 text-muted-foreground" />
                      <span>Scholarship Directory</span>
                    </Link>

                    <Link
                      href="/find-scholarships"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-muted transition-colors text-foreground"
                    >
                      <Sparkles className="size-4 text-muted-foreground" />
                      <span>Eligibility Matcher</span>
                    </Link>
                  </div>

                  <Separator className="my-1.5" />

                  {/* Sign Out Button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/login" prefetch={true}>
                <Button variant="ghost" size="sm" className="font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" prefetch={true}>
                <Button size="sm" className="font-bold">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions: Theme Toggle + Hamburger Button */}
        <div className="mobile-actions" style={{ alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="mobile-toggle"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: 4,
              color: "var(--ink)",
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            background: "var(--card)",
            borderBottom: "1px solid var(--line)",
            padding: "16px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {user ? (
            <>
              <Link href="/check" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
                Check an Offer
              </Link>
              <Link href="/directory" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
                Directory
              </Link>
              <Link href="/find-scholarships" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
                Find Scholarships
              </Link>
              <Link href="/dashboard" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
                Student Dashboard
              </Link>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar size="default" className="size-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    <strong style={{ color: "var(--ink)" }}>{user.name}</strong>
                    <div style={{ fontSize: "0.8rem" }}>{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <LogOut className="size-3.5" />
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                <Link href="/login" onClick={closeMobile} className="btn ghost" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>
                  Sign In
                </Link>
                <Link href="/register" onClick={closeMobile} className="btn" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>
                  Create Account
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
