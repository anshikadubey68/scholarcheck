"use client";
import Link from "next/link";
import { useState } from "react";
import RiskBadge, { LEVEL_LABEL } from "./RiskBadge";
import type { AnalysisResult } from "../lib/detector/types";

export interface Item { id: string; name: string; org: string; url: string; score: number; level: AnalysisResult["level"]; }
type Filter = "all" | AnalysisResult["level"];

export default function DirectoryList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const shown = items.filter(
    (i) => (filter === "all" || i.level === filter) && `${i.name} ${i.org}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="tools">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or organization" aria-label="Search scholarships" />
        {(["all", "safe", "suspicious", "high-risk"] as Filter[]).map((f) => (
          <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : LEVEL_LABEL[f]}
          </button>
        ))}
      </div>
      <ul className="list">
        {shown.map((i) => (
          <li key={i.id}>
            <Link href={`/scholarship/${i.id}`} className="item">
              <span><strong>{i.name}</strong><small>{i.org}, risk {i.score} / 100</small></span>
              <RiskBadge level={i.level} />
            </Link>
          </li>
        ))}
        {shown.length === 0 && <li className="empty">No scholarships match. Clear the search or pick another filter.</li>}
      </ul>
    </>
  );
}