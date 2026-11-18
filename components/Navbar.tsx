"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If user is already loaded, avoid redundant network requests on navigation
    if (user && pathname !== "/login" && pathname !== "/register") {
      return;
    }

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname, user]);

  const closeMobile = () => setMobileMenuOpen(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="site-head" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="site-head-container">
        {/* Leftmost Section: Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center", justifySelf: "start" }}>
          <Link
            href="/"
            className="brand"
            onClick={closeMobile}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.25rem" }}
          >
            <span style={{ fontSize: "1.4rem" }}>🛡️</span>
            <span>ScholarCheck</span>
          </Link>
        </div>

        {/* Middle Section: Centered Navigation Links */}
        <nav
          className="desktop-nav"
          aria-label="Main"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}
        >
          <Link
            href="/"
            prefetch={true}
            style={{
              color: isActive("/") && pathname === "/" ? "var(--ink)" : "var(--muted)",
              fontWeight: isActive("/") && pathname === "/" ? 700 : 600,
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
                style={{
                  background: "var(--btn-bg)",
                  color: "var(--btn-text)",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                👤 {user.name.split(" ")[0]}
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href="/login"
                prefetch={true}
                style={{
                  color: "var(--muted)",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                prefetch={true}
                className="btn"
                style={{
                  padding: "7px 16px",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Create Account
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
          <Link href="/" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
            Check an Offer
          </Link>
          <Link href="/directory" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
            Directory
          </Link>
          <Link href="/find-scholarships" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
            Find Scholarships
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" onClick={closeMobile} style={{ textDecoration: "none", fontWeight: 600, color: "var(--ink)", fontSize: "1.05rem" }}>
                Student Dashboard
              </Link>
              <div style={{ paddingTop: 8, borderTop: "1px solid var(--line)", fontSize: "0.9rem", color: "var(--muted)" }}>
                Signed in as <strong>{user.name}</strong> ({user.email})
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <Link href="/login" onClick={closeMobile} className="btn ghost" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>
                Sign In
              </Link>
              <Link href="/register" onClick={closeMobile} className="btn" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
