"use client";

import type { AnalysisResult } from "../lib/detector/types";
import ReportView from "./ReportView";

interface ResultViewProps {
  result: AnalysisResult;
  onReset?: () => void;
}

export default function ResultView({ result, onReset }: ResultViewProps) {
  return <ReportView result={result} onReset={onReset} />;
}
