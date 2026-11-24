"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  scholarshipId: string;
  initialSaved?: boolean;
  size?: "sm" | "md";
  className?: string;
  onToggle?: (saved: boolean) => void;
}

export default function BookmarkButton({
  scholarshipId,
  initialSaved = false,
  size = "md",
  className,
  onToggle,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [prevInitialSaved, setPrevInitialSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (initialSaved !== prevInitialSaved) {
    setPrevInitialSaved(initialSaved);
    setSaved(initialSaved);
  }

  const handleToggle = async (pressedState?: boolean) => {
    if (loading) return;
    setLoading(true);
    const nextState = typeof pressedState === "boolean" ? pressedState : !saved;
    setSaved(nextState);
    onToggle?.(nextState);

    try {
      const res = await fetch("/api/bookmarks", {
        method: nextState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });

      if (res.status === 401) {
        setSaved(initialSaved);
        onToggle?.(initialSaved);
        router.push("/login?redirect=/directory");
        return;
      }

      if (!res.ok) {
        setSaved(initialSaved);
        onToggle?.(initialSaved);
      } else {
        window.dispatchEvent(
          new CustomEvent("bookmarks-change", {
            detail: { scholarshipId, saved: nextState },
          })
        );
      }
    } catch {
      setSaved(initialSaved);
      onToggle?.(initialSaved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={size === "sm" ? "sm" : "default"}
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      disabled={loading}
      aria-label={saved ? "Remove bookmark" : "Bookmark scholarship"}
      title={saved ? "Saved in Dashboard" : "Save scholarship"}
      className={cn(
        "cursor-pointer font-medium transition-all select-none gap-1.5",
        saved
          ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
          : "border-border text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Bookmark
        className={cn(
          size === "sm" ? "size-3.5" : "size-4",
          "transition-all duration-200",
          saved ? "fill-rose-500 text-rose-500 scale-105" : "text-muted-foreground"
        )}
      />
      <span className={cn(size === "sm" ? "text-xs font-semibold" : "text-sm font-semibold")}>
        {saved ? "Saved" : "Save"}
      </span>
    </Button>
  );
}
