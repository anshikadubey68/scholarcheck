"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("student@scholarcheck.org");
    setPassword("Password123!");
    setError(null);
  };

  return (
    <div style={{ maxWidth: 460, margin: "40px auto 80px", padding: "0 10px" }}>
      <div className="panel">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 6px", color: "var(--ink)" }}>
            Student Login
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0 }}>
            Access your verified checks, saved scholarships, and eligibility matches
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya.sharma@gmail.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, padding: 0 }}
            >
              Fill Demo Student Credentials
            </button>
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "1rem", marginBottom: 16 }}
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>

          {error && (
            <p className="error" role="alert" style={{ textAlign: "center", margin: "10px 0" }}>
              {error}
            </p>
          )}

          <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--muted)", marginTop: 20 }}>
            Don&apos;t have an account yet?{" "}
            <Link href="/register" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline" }}>
              Create free student account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
