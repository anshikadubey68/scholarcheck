"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto 80px", padding: "0 10px" }}>
      <div className="panel">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 6px", color: "var(--ink)" }}>
            Create Student Account
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0 }}>
            Join ScholarCheck to save opportunities, track verifications, and discover eligible grants
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              required
            />
          </label>

          <label className="field">
            <span>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul.verma@college.edu"
              required
            />
          </label>

          <label className="field">
            <span>Password (min. 6 characters)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "1rem", marginTop: 8, marginBottom: 16 }}
          >
            {loading ? "Creating Account..." : "Create Account & Get Started"}
          </button>

          {error && (
            <p className="error" role="alert" style={{ textAlign: "center", margin: "10px 0" }}>
              {error}
            </p>
          )}

          <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--muted)", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline" }}>
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
