"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  scholarshipId: string;
  initialSaved?: boolean;
  size?: "sm" | "md";
}

export default function BookmarkButton({ scholarshipId, initialSaved = false, size = "md" }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    const nextState = !saved;
    setSaved(nextState);

    try {
      const res = await fetch("/api/bookmarks", {
        method: nextState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });

      if (res.status === 401) {
        setSaved(initialSaved);
        router.push("/login?redirect=/directory");
        return;
      }

      if (!res.ok) {
        setSaved(initialSaved);
      }
    } catch {
      setSaved(initialSaved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? "Remove bookmark" : "Bookmark scholarship"}
      title={saved ? "Saved in Dashboard" : "Save scholarship"}
      style={{
        background: saved ? "#FEF2F2" : "transparent",
        color: saved ? "#DC2626" : "var(--muted)",
        border: saved ? "1px solid #FECACA" : "1px solid #D5DEE4",
        borderRadius: "6px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: size === "sm" ? "4px 8px" : "8px 12px",
        fontSize: size === "sm" ? "0.8rem" : "0.9rem",
        fontWeight: 600,
        gap: 6,
        transition: "all 0.2s ease",
      }}
    >
      <span>{saved ? "❤️" : "🤍"}</span>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}

