"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import BookmarkButton from "./BookmarkButton";
import type { ScholarshipDetail } from "../lib/scholarships";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Search, X } from "lucide-react";

interface DirectoryListProps {
  scholarships: ScholarshipDetail[];
  initialBookmarks?: string[];
}

export default function DirectoryList({ scholarships, initialBookmarks = [] }: DirectoryListProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "amount" | "deadline">("latest");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(initialBookmarks));
  const [prevInitialBookmarks, setPrevInitialBookmarks] = useState(initialBookmarks);

  if (initialBookmarks !== prevInitialBookmarks) {
    setPrevInitialBookmarks(initialBookmarks);
    setSavedIds(new Set(initialBookmarks));
  }

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => (res.ok ? res.json() : { bookmarks: [] }))
      .then((data) => {
        if (Array.isArray(data.bookmarks)) {
          setSavedIds(new Set(data.bookmarks));
        }
      })
      .catch(() => {});

    const handleBookmarksChange = (e: Event) => {
      const detail = (e as CustomEvent<{ scholarshipId: string; saved: boolean }>).detail;
      if (detail && detail.scholarshipId) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (detail.saved) {
            next.add(detail.scholarshipId);
          } else {
            next.delete(detail.scholarshipId);
          }
          return next;
        });
      }
    };

    window.addEventListener("bookmarks-change", handleBookmarksChange);
    return () => {
      window.removeEventListener("bookmarks-change", handleBookmarksChange);
    };
  }, []);

  const filtered = useMemo(() => {
    return scholarships.filter((item) => {
      // 1. Text search
      const q = query.toLowerCase().trim();
      if (q && !item.name.toLowerCase().includes(q) && !item.organization.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
        return false;
      }
      // 2. Type filter
      if (typeFilter !== "all" && item.type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }
      // 3. Level filter
      if (levelFilter !== "all" && item.educationLevel.toLowerCase() !== levelFilter.toLowerCase()) {
        return false;
      }
      // 4. Stream filter
      if (streamFilter !== "all" && item.stream.toLowerCase() !== "any" && item.stream.toLowerCase() !== streamFilter.toLowerCase()) {
        return false;
      }
      // 5. Verification status filter
      if (statusFilter !== "all" && item.verificationStatus.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      // 6. Country filter
      if (countryFilter !== "all" && item.country.toLowerCase() !== countryFilter.toLowerCase()) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // Latest
      return b.id.localeCompare(a.id);
    });
  }, [scholarships, query, typeFilter, levelFilter, streamFilter, statusFilter, countryFilter, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setLevelFilter("all");
    setStreamFilter("all");
    setStatusFilter("all");
    setCountryFilter("all");
    setSortBy("latest");
  };

  const hasActiveFilters =
    query !== "" ||
    typeFilter !== "all" ||
    levelFilter !== "all" ||
    streamFilter !== "all" ||
    statusFilter !== "all" ||
    countryFilter !== "all" ||
    sortBy !== "latest";

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Search & Multi-Filters Panel */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <InputGroup className="h-10 rounded-lg border-input bg-card shadow-xs">
              <InputGroupAddon align="inline-start">
                <Search className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by scholarship name, organization, or keywords..."
                className="text-[0.95rem] text-foreground placeholder:text-muted-foreground"
              />
              {query && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="size-3.5 text-muted-foreground" />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--muted)" }}>Sort by:</span>
            <NativeSelect
              size="lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "amount" | "deadline")}
              className="w-[190px]"
              selectClassName="font-semibold text-[0.875rem]"
            >
              <NativeSelectOption value="latest">Featured & Latest</NativeSelectOption>
              <NativeSelectOption value="amount">Highest Grant Amount</NativeSelectOption>
              <NativeSelectOption value="deadline">Nearest Deadline</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Funding Type
            </label>
            <NativeSelect
              className="w-full"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <NativeSelectOption value="all">All Types</NativeSelectOption>
              <NativeSelectOption value="government">Government</NativeSelectOption>
              <NativeSelectOption value="private">Private Foundation</NativeSelectOption>
              <NativeSelectOption value="international">International</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Education Level
            </label>
            <NativeSelect
              className="w-full"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <NativeSelectOption value="all">All Levels</NativeSelectOption>
              <NativeSelectOption value="undergraduate">Undergraduate</NativeSelectOption>
              <NativeSelectOption value="postgraduate">Postgraduate</NativeSelectOption>
              <NativeSelectOption value="school">School / Higher Secondary</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Academic Stream
            </label>
            <NativeSelect
              className="w-full"
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
            >
              <NativeSelectOption value="all">Any Stream</NativeSelectOption>
              <NativeSelectOption value="engineering">Engineering</NativeSelectOption>
              <NativeSelectOption value="medical">Medical & Healthcare</NativeSelectOption>
              <NativeSelectOption value="science">Sciences</NativeSelectOption>
              <NativeSelectOption value="humanities">Humanities & Social</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Country / Region
            </label>
            <NativeSelect
              className="w-full"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <NativeSelectOption value="all">All Locations</NativeSelectOption>
              <NativeSelectOption value="india">India</NativeSelectOption>
              <NativeSelectOption value="united kingdom">United Kingdom</NativeSelectOption>
              <NativeSelectOption value="united states">United States</NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
              Verification Status
            </label>
            <NativeSelect
              className="w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <NativeSelectOption value="all">All Statuses</NativeSelectOption>
              <NativeSelectOption value="verified genuine">Verified Genuine</NativeSelectOption>
              <NativeSelectOption value="needs review">Needs Review</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        {hasActiveFilters && (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Showing <strong>{filtered.length}</strong> of {scholarships.length} scholarships
            </span>
            <button
              type="button"
              onClick={resetFilters}
              style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, padding: 0 }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Scholarship Cards Grid */}
      {filtered.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>🔎</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>No scholarships matched your filters</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "0 0 16px" }}>
            Try broadening your search term or clearing one or more active filter options.
          </p>
          <button type="button" className="btn ghost" onClick={resetFilters}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filtered.map((item) => {
            const isVerified = item.verificationStatus === "Verified Genuine";
            const deadlineText = item.deadline
              ? new Date(item.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Ongoing / Rolling";

            return (
              <div
                key={item.id}
                className="panel"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  position: "relative",
                }}
              >
                {/* Header line: Title + Status + Bookmark */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span
                        className={item.type === "Government" ? "type-badge-gov" : "type-badge-private"}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {item.type}
                      </span>
                      <span
                        className={isVerified ? "status-badge-verified" : "status-badge-review"}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {isVerified ? "✓ Verified Genuine" : "⚠️ Needs Review"}
                      </span>
                    </div>

                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "2px 0 4px", color: "var(--ink)" }}>
                      <Link href={`/scholarship/${item.slug || item.id}`} style={{ textDecoration: "none" }}>
                        {item.name}
                      </Link>
                    </h2>
                    <span style={{ fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>
                      By {item.organization} • {item.country}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <BookmarkButton
                      scholarshipId={item.id}
                      initialSaved={savedIds.has(item.id)}
                      size="sm"
                      onToggle={(isSaved) => {
                        setSavedIds((prev) => {
                          const next = new Set(prev);
                          if (isSaved) {
                            next.add(item.id);
                          } else {
                            next.delete(item.id);
                          }
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Description summary */}
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.5 }}>
                  {item.description}
                </p>

                {/* Key metadata badges: Amount, Level, Deadline */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                    padding: "10px 14px",
                    background: "var(--paper)",
                    borderRadius: 6,
                    fontSize: "0.85rem",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: "0.75rem" }}>Grant / Award:</span>
                    <strong style={{ color: "var(--ink)" }}>{item.amountFormatted}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: "0.75rem" }}>Education Level:</span>
                    <strong style={{ color: "var(--ink)" }}>{item.educationLevel} ({item.stream})</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: "0.75rem" }}>Application Deadline:</span>
                    <strong style={{ color: "var(--ink)" }}>{deadlineText}</strong>
                  </div>
                </div>

                {/* Bottom actions: Official link + View Details */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, flexWrap: "wrap", gap: 10 }}>
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.85rem", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}
                  >
                    <span>🌐 Official Portal</span>
                    <span style={{ fontSize: "0.75rem" }}>↗</span>
                  </a>

                  <Link
                    href={`/scholarship/${item.slug || item.id}`}
                    className="btn"
                    style={{ padding: "8px 18px", fontSize: "0.875rem", textDecoration: "none" }}
                  >
                    View Details & Requirements →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
