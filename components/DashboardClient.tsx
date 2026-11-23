"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Shield, Laptop, CheckCircle, RefreshCw } from "lucide-react";

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    profile: {
      fullName: string;
      educationLevel: string;
      course: string;
      academicYear: string;
      institution: string;
      gpaOrPercentage: number;
      familyIncome: number;
      state: string;
      country: string;
      category: string;
    } | null;
  };
  savedScholarships: Array<{
    id: string;
    scholarship: {
      id: string;
      slug: string;
      name: string;
      organization: string;
      type: string;
      amountFormatted: string;
      deadline: string | null;
      verificationStatus: string;
      websiteUrl: string;
    };
  }>;
  recentVerifications: Array<{
    id: string;
    url: string | null;
    orgName: string | null;
    score: number;
    level: string;
    summary: string;
    createdAt: string;
  }>;
}

export default function DashboardClient({
  user,
  savedScholarships: initialSaved,
  recentVerifications,
}: DashboardProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [prevInitialSaved, setPrevInitialSaved] = useState(initialSaved);

  if (initialSaved !== prevInitialSaved) {
    setPrevInitialSaved(initialSaved);
    setSaved(initialSaved);
  }
  const [profile, setProfile] = useState(user.profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user.profile?.fullName || user.name,
    educationLevel: user.profile?.educationLevel || "Undergraduate",
    course: user.profile?.course || "B.Tech Computer Science",
    academicYear: user.profile?.academicYear || "3rd Year",
    institution: user.profile?.institution || "Delhi Technological University",
    gpaOrPercentage: user.profile?.gpaOrPercentage || 8.0,
    familyIncome: user.profile?.familyIncome || 250000,
    state: user.profile?.state || "Delhi",
    category: user.profile?.category || "General",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [revokingSessions, setRevokingSessions] = useState(false);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  const handleRevokeOtherSessions = async () => {
    setRevokingSessions(true);
    setSessionMessage(null);
    try {
      if (typeof authClient.revokeOtherSessions === "function") {
        await authClient.revokeOtherSessions();
      }
      setSessionMessage("All other active sessions have been signed out.");
      setTimeout(() => setSessionMessage(null), 4000);
    } catch (err: unknown) {
      setSessionMessage(err instanceof Error ? err.message : "Failed to revoke sessions.");
    } finally {
      setRevokingSessions(false);
    }
  };

  const handleRemoveBookmark = async (scholarshipId: string) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });
      if (res.ok) {
        setSaved((prev) => prev.filter((item) => item.scholarship.id !== scholarshipId));
        window.dispatchEvent(
          new CustomEvent("bookmarks-change", {
            detail: { scholarshipId, saved: false },
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setIsEditingProfile(false);
        setProfileMessage("Academic profile updated successfully!");
        setTimeout(() => setProfileMessage(null), 3500);
      }
    } catch {
      setProfileMessage("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      window.dispatchEvent(new CustomEvent("auth-change", { detail: { user: null } }));
      window.location.href = "/";
    }
  };

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Top Welcome Header */}
      <div
        className="panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          padding: "24px 28px",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size="lg" className="size-14 border border-border shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
              Student Portal
            </span>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: "4px 0", color: "var(--ink)" }}>
              Welcome back, {user.name}!
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0 }}>
              {profile?.course} • {profile?.institution || "Student"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/find-scholarships" className="btn" style={{ padding: "10px 18px", textDecoration: "none" }}>
            🎯 Find Matched Grants
          </Link>
          <button type="button" onClick={handleLogout} className="btn ghost" style={{ padding: "10px 18px" }}>
            Sign Out
          </button>
        </div>
      </div>

      {profileMessage && (
        <div className="zero-warning-banner" style={{ marginBottom: 20 }}>
          ✓ {profileMessage}
        </div>
      )}

      {/* Key Metric Highlights Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="panel" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
            Saved Opportunities
          </span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>
            {saved.length}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Bookmarked for review</span>
        </div>

        <div className="panel" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
            Total Checks Conducted
          </span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>
            {recentVerifications.length}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Scam screening history</span>
        </div>

        <div className="panel" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
            Academic Standing
          </span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>
            {profile?.gpaOrPercentage ? `${profile.gpaOrPercentage} GPA` : "N/A"}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{profile?.educationLevel}</span>
        </div>

        <div className="panel" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
            Family Income Range
          </span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)", marginTop: 8 }}>
            ₹{(profile?.familyIncome || 0).toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Annual income threshold</span>
        </div>
      </div>

      {/* Main 2-Column Dashboard Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 24, alignItems: "start" }}>
        {/* Left Column: Saved Scholarships & Verification History */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Saved Scholarships List */}
          <div className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🔖</span> Saved Scholarships ({saved.length})
              </h2>
              <Link href="/directory" style={{ fontSize: "0.85rem", color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
                Browse More →
              </Link>
            </div>

            {saved.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--muted)" }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>No scholarships bookmarked yet.</p>
                <Link href="/directory" className="btn ghost" style={{ fontSize: "0.85rem", textDecoration: "none" }}>
                  Explore Directory
                </Link>
              </div>
            ) : (
              <div className="saved-scholarships-scroll" style={{ display: "grid", gap: 12 }}>
                {saved.map((item) => {
                  const s = item.scholarship;
                  const deadlineStr = s.deadline
                    ? new Date(s.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "Rolling";

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        background: "var(--paper)",
                        borderRadius: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <Link
                          href={`/scholarship/${s.slug || s.id}`}
                          style={{ fontWeight: 700, color: "var(--ink)", textDecoration: "none", fontSize: "0.95rem" }}
                        >
                          {s.name}
                        </Link>
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                          {s.organization} • <strong>{s.amountFormatted}</strong> • Deadline: {deadlineStr}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Link
                          href={`/scholarship/${s.slug || s.id}`}
                          className="btn ghost"
                          style={{
                            fontSize: "0.8rem",
                            padding: "6px 12px",
                            textDecoration: "none",
                            fontWeight: 600,
                            background: "var(--card)",
                            color: "var(--ink)",
                            border: "1px solid var(--line)",
                          }}
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveBookmark(s.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#DC2626",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            padding: "4px 8px",
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Verification History */}
          <div className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🛡️</span> Recent Fraud Checks ({recentVerifications.length})
              </h2>
              <Link href="/" style={{ fontSize: "0.85rem", color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
                Check an Offer →
              </Link>
            </div>

            {recentVerifications.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
                No verification scans recorded yet. Use the homepage checker to screen any suspicious scholarship.
              </p>
            ) : (
              <div className="recent-checks-scroll" style={{ display: "grid", gap: 10 }}>
                {recentVerifications.map((v) => {
                  const dateStr = new Date(v.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={v.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        border: "1px solid var(--line)",
                        borderRadius: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)" }}>
                          {v.orgName || v.url || "Scholarship Text Analysis"}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                          {dateStr}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          className={`risk-badge ${v.level}`}
                          style={{
                            padding: "3px 10px",
                            fontSize: "0.75rem",
                          }}
                        >
                          Risk: {v.score} / 100 ({v.level})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Academic Profile Card & Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                Academic Profile
              </h2>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}
              >
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile}>
                <label className="field">
                  <span>Full Name</span>
                  <input
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    required
                  />
                </label>

                <label className="field">
                  <span>Course / Degree</span>
                  <input
                    value={profileForm.course}
                    onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                    required
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <label className="field">
                    <span>Year of Study</span>
                    <NativeSelect
                      className="w-full"
                      value={profileForm.academicYear}
                      onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
                    >
                      <NativeSelectOption value="1st Year">1st Year</NativeSelectOption>
                      <NativeSelectOption value="2nd Year">2nd Year</NativeSelectOption>
                      <NativeSelectOption value="3rd Year">3rd Year</NativeSelectOption>
                      <NativeSelectOption value="Final Year">Final Year</NativeSelectOption>
                      <NativeSelectOption value="Postgraduate">Postgraduate</NativeSelectOption>
                    </NativeSelect>
                  </label>

                  <label className="field">
                    <span>CGPA / Percentage</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={profileForm.gpaOrPercentage}
                      onChange={(e) => setProfileForm({ ...profileForm, gpaOrPercentage: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </label>
                </div>

                <label className="field">
                  <span>College / Institution</span>
                  <input
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                    required
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <label className="field">
                    <span>Annual Family Income (₹)</span>
                    <input
                      type="number"
                      value={profileForm.familyIncome}
                      onChange={(e) => setProfileForm({ ...profileForm, familyIncome: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </label>

                  <label className="field">
                    <span>State / Domicile</span>
                    <input
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      required
                    />
                  </label>
                </div>

                <label className="field">
                  <span>Social / Eligibility Category</span>
                  <NativeSelect
                    className="w-full"
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                  >
                    <NativeSelectOption value="General">General</NativeSelectOption>
                    <NativeSelectOption value="OBC">OBC (Other Backward Classes)</NativeSelectOption>
                    <NativeSelectOption value="SC">SC (Scheduled Caste)</NativeSelectOption>
                    <NativeSelectOption value="ST">ST (Scheduled Tribe)</NativeSelectOption>
                    <NativeSelectOption value="EWS">EWS (Economically Weaker Section)</NativeSelectOption>
                    <NativeSelectOption value="Minority">Notified Religious Minority</NativeSelectOption>
                  </NativeSelect>
                </label>

                <button
                  type="submit"
                  className="btn"
                  disabled={savingProfile}
                  style={{ width: "100%", padding: "10px", marginTop: 8 }}
                >
                  {savingProfile ? "Saving Profile..." : "Update Profile"}
                </button>
              </form>
            ) : (
              <div style={{ display: "grid", gap: 10, fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>Student:</span>
                  <strong style={{ color: "var(--ink)" }}>{profile?.fullName || user.name}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>Degree:</span>
                  <strong style={{ color: "var(--ink)" }}>{profile?.course} ({profile?.academicYear})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>Institution:</span>
                  <strong style={{ color: "var(--ink)" }}>{profile?.institution}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>Academic Standing:</span>
                  <strong style={{ color: "var(--ink)" }}>{profile?.gpaOrPercentage} CGPA / Score</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>Annual Income:</span>
                  <strong style={{ color: "var(--ink)" }}>₹{(profile?.familyIncome || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>State:</span>
                  <strong style={{ color: "var(--ink)" }}>{profile?.state}, {profile?.country}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Category:</span>
                  <strong style={{ color: "var(--ink)" }}>{profile?.category}</strong>
                </div>

                <div style={{ marginTop: 14 }}>
                  <Link
                    href="/find-scholarships"
                    className="btn ghost"
                    style={{ width: "100%", textAlign: "center", padding: "8px", textDecoration: "none", fontSize: "0.85rem", display: "block" }}
                  >
                    Match Scholarships With This Profile →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Better Auth Security & Active Sessions Card */}
          <div className="panel" style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Shield className="size-4 text-primary" />
                <span>Security & Sessions</span>
              </h2>
              <Badge variant="outline" className="text-[11px] gap-1 font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle className="size-3" />
                Better Auth Protected
              </Badge>
            </div>

            <div style={{ display: "grid", gap: 12, fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--muted)" }}>Email Account:</span>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>{user.email}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--muted)" }}>Session Provider:</span>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>Neon PostgreSQL (Prisma)</span>
              </div>

              <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--paper)", border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Laptop className="size-4 text-muted-foreground" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--ink)" }}>
                        Current Browser Session
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                        Active now • Secure Cookie Token
                      </div>
                    </div>
                  </div>
                  <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                </div>
              </div>

              {sessionMessage && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  ✓ {sessionMessage}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={revokingSessions}
                onClick={handleRevokeOtherSessions}
                className="w-full text-xs font-semibold gap-1.5 h-9 mt-1"
              >
                <RefreshCw className={`size-3.5 ${revokingSessions ? "animate-spin" : ""}`} />
                {revokingSessions ? "Revoking..." : "Sign Out All Other Devices"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
