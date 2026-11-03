"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
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

  const handleRemoveBookmark = async (scholarshipId: string) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });
      if (res.ok) {
        setSaved((prev) => prev.filter((item) => item.scholarship.id !== scholarshipId));
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
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
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
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", padding: "12px 18px", borderRadius: 8, marginBottom: 20, fontSize: "0.9rem" }}>
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
              <div style={{ display: "grid", gap: 12 }}>
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
                          style={{
                            fontSize: "0.8rem",
                            padding: "6px 12px",
                            background: "#fff",
                            border: "1px solid #D5DEE4",
                            borderRadius: 6,
                            textDecoration: "none",
                            color: "var(--ink)",
                            fontWeight: 600,
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
              <div style={{ display: "grid", gap: 10 }}>
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
                          style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            background: v.score <= 25 ? "#ECFDF5" : v.score <= 55 ? "#FEF3C7" : "#FEE2E2",
                            color: v.score <= 25 ? "#065F46" : v.score <= 55 ? "#92400E" : "#991B1B",
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
                    <select
                      value={profileForm.academicYear}
                      onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #AEBBC6", background: "#fff" }}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
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
                  <select
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #AEBBC6", background: "#fff" }}
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Notified Religious Minority</option>
                  </select>
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
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "var(--muted)" }}>Student:</span>
                  <strong>{profile?.fullName || user.name}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "var(--muted)" }}>Degree:</span>
                  <strong>{profile?.course} ({profile?.academicYear})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "var(--muted)" }}>Institution:</span>
                  <strong>{profile?.institution}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "var(--muted)" }}>Academic Standing:</span>
                  <strong>{profile?.gpaOrPercentage} CGPA / Score</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "var(--muted)" }}>Annual Income:</span>
                  <strong>₹{(profile?.familyIncome || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "var(--muted)" }}>State:</span>
                  <strong>{profile?.state}, {profile?.country}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Category:</span>
                  <strong>{profile?.category}</strong>
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
        </div>
      </div>
    </div>
  );
}
