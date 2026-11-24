"use client";

import { useState } from "react";
import AiLiveFinderView from "./AiLiveFinderView";
import EligibilityMatcher from "./EligibilityMatcher";
import type { ScholarshipDetail } from "@/lib/scholarships";
import type { StudentProfileParams } from "@/lib/aiScholarshipFinder";
import { Sparkles, BookOpen } from "lucide-react";

interface FindScholarshipsClientProps {
  scholarships: ScholarshipDetail[];
  initialProfile?: Partial<StudentProfileParams> | null;
}

export default function FindScholarshipsClient({
  scholarships,
  initialProfile,
}: FindScholarshipsClientProps) {
  const [activeTab, setActiveTab] = useState<"ai-live" | "directory-matcher">("ai-live");

  return (
    <div>
      {/* Top Tab Navigator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: 4,
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("ai-live")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              background: activeTab === "ai-live" ? "var(--ink)" : "transparent",
              color: activeTab === "ai-live" ? "var(--bg)" : "var(--muted)",
              transition: "all 0.15s ease",
            }}
          >
            <Sparkles className="size-4 text-purple-500" />
            <span>AI Live Discovery (Gemini)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("directory-matcher")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              background: activeTab === "directory-matcher" ? "var(--ink)" : "transparent",
              color: activeTab === "directory-matcher" ? "var(--bg)" : "var(--muted)",
              transition: "all 0.15s ease",
            }}
          >
            <BookOpen className="size-4 text-blue-500" />
            <span>Directory Matcher ({scholarships.length})</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === "ai-live" ? (
        <AiLiveFinderView initialProfile={initialProfile} />
      ) : (
        <EligibilityMatcher scholarships={scholarships} initialProfile={initialProfile} />
      )}
    </div>
  );
}
