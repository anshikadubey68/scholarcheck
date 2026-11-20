"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshUser = () => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  };

  useEffect(() => {
    refreshUser();

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ user?: UserInfo | null }>;
      if (customEvent.detail && "user" in customEvent.detail) {
        setUser(customEvent.detail.user ?? null);
      } else {
        refreshUser();
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [pathname]);

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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href="/dashboard"
                prefetch={true}
                style={{
                  color: isActive("/dashboard") ? "var(--ink)" : "var(--muted)",
                  fontWeight: isActive("/dashboard") ? 700 : 600,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                prefetch={true}
                className="desktop-user-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 9999,
                  padding: "4px 12px 4px 6px",
                  color: "var(--ink)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
              >
                <Avatar size="sm" className="size-6">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name.split(" ")[0]}</span>
              </Link>
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
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                <Avatar size="default" className="size-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  Signed in as <strong style={{ color: "var(--ink)" }}>{user.name}</strong>
                  <div style={{ fontSize: "0.8rem" }}>{user.email}</div>
                </div>
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
