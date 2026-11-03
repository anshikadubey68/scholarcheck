"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const closeMobile = () => setMobileMenuOpen(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="site-head" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Brand */}
        <Link href="/" className="brand" onClick={closeMobile} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.25rem" }}>
          <span style={{ fontSize: "1.4rem" }}>🛡️</span>
          <span>ScholarCheck</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav desktop-nav" aria-label="Main" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            href="/"
            style={{
              color: isActive("/") && pathname === "/" ? "var(--ink)" : "var(--muted)",
              fontWeight: isActive("/") && pathname === "/" ? 700 : 600,
              textDecoration: "none",
            }}
          >
            Check an Offer
          </Link>
          <Link
            href="/directory"
            style={{
              color: isActive("/directory") ? "var(--ink)" : "var(--muted)",
              fontWeight: isActive("/directory") ? 700 : 600,
              textDecoration: "none",
            }}
          >
            Directory
          </Link>
          <Link
            href="/find-scholarships"
            style={{
              color: isActive("/find-scholarships") ? "var(--ink)" : "var(--muted)",
              fontWeight: isActive("/find-scholarships") ? 700 : 600,
              textDecoration: "none",
            }}
          >
            Find Scholarships
          </Link>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 8 }}>
              <Link
                href="/dashboard"
                style={{
                  color: isActive("/dashboard") ? "var(--ink)" : "var(--muted)",
                  fontWeight: isActive("/dashboard") ? 700 : 600,
                  textDecoration: "none",
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                style={{
                  background: "var(--ink)",
                  color: "#fff",
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 8 }}>
              <Link
                href="/login"
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
        </nav>

        {/* Mobile Hamburger Button */}
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

