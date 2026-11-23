import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Search,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Globe,
  CreditCard,
  Timer,
  CheckCircle,
  Users,
  FileCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  // Auth redirect is handled by middleware — no DB call needed here.
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-semibold">
          <Shield className="size-3.5" />
          AI-Powered Anti-Fraud Protection
        </Badge>

        <h1 className="landing-hero-title">
          Protect yourself from
          <br />
          <span className="landing-hero-accent">scholarship scams</span>
        </h1>

        <p className="landing-hero-desc">
          Verify scholarship offers in seconds, discover legitimate funding opportunities,
          and match with grants tailored to your academic profile — all in one platform.
        </p>

        <div className="landing-hero-actions">
          <Link href="/register">
            <Button size="lg" className="h-11 px-6 text-sm font-bold gap-2">
              Get Started Free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="landing-stats">
          <div className="landing-stat">
            <span className="landing-stat-num">15+</span>
            <span className="landing-stat-label">Verified Scholarships</span>
          </div>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <div className="landing-stat">
            <span className="landing-stat-num">6-Point</span>
            <span className="landing-stat-label">Fraud Detection</span>
          </div>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <div className="landing-stat">
            <span className="landing-stat-num">AI + Rules</span>
            <span className="landing-stat-label">Hybrid Analysis</span>
          </div>
        </div>
      </section>

      <Separator className="my-2" />

      {/* Features Section */}
      <section className="landing-section">
        <div className="landing-section-header">
          <Badge variant="outline" className="mb-3 gap-1.5">
            <Sparkles className="size-3" />
            Core Features
          </Badge>
          <h2 className="landing-section-title">Everything students need in one place</h2>
          <p className="landing-section-desc">
            From scam detection to scholarship discovery — ScholarCheck is your complete toolkit.
          </p>
        </div>

        <div className="landing-features-grid">
          <Card className="landing-feature-card">
            <CardHeader>
              <div className="landing-feature-icon bg-red-500/10 text-red-600 dark:text-red-400">
                <Shield className="size-5" />
              </div>
              <CardTitle className="text-[0.95rem] font-bold">Scam Verification</CardTitle>
              <CardDescription>
                Paste any scholarship URL or message text. Our engine screens for deceptive domains, upfront fees, copied text, and pressure tactics — with evidence for every flag.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="landing-feature-card">
            <CardHeader>
              <div className="landing-feature-icon bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BookOpen className="size-5" />
              </div>
              <CardTitle className="text-[0.95rem] font-bold">Verified Directory</CardTitle>
              <CardDescription>
                Browse pre-screened government, private, and international scholarships. Filter by education level, stream, region, and verification status.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="landing-feature-card">
            <CardHeader>
              <div className="landing-feature-icon bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="size-5" />
              </div>
              <CardTitle className="text-[0.95rem] font-bold">Eligibility Matching</CardTitle>
              <CardDescription>
                Enter your academic profile — course, GPA, income, category — and get a ranked list of scholarships you actually qualify for.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="landing-feature-card">
            <CardHeader>
              <div className="landing-feature-icon bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Search className="size-5" />
              </div>
              <CardTitle className="text-[0.95rem] font-bold">Smart Dashboard</CardTitle>
              <CardDescription>
                Save scholarships, track your verification history, and manage your academic profile — all from a personalized student dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Separator className="my-2" />

      {/* How It Works Section */}
      <section className="landing-section">
        <div className="landing-section-header">
          <Badge variant="outline" className="mb-3 gap-1.5">
            <FileCheck className="size-3" />
            How It Works
          </Badge>
          <h2 className="landing-section-title">Multi-layered fraud detection</h2>
          <p className="landing-section-desc">
            Our hybrid AI + rule-based engine runs six independent checks on every scholarship offer.
          </p>
        </div>

        <div className="landing-checks-grid">
          <div className="landing-check-item">
            <div className="landing-check-icon">
              <Globe className="size-5" />
            </div>
            <div>
              <h3 className="landing-check-title">Domain Analysis</h3>
              <p className="landing-check-desc">
                Detects typosquatting, throwaway TLDs (.xyz, .top), and deceptive subdomains spoofing government portals.
              </p>
            </div>
          </div>

          <div className="landing-check-item">
            <div className="landing-check-icon">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h3 className="landing-check-title">Fee Detection</h3>
              <p className="landing-check-desc">
                Screens for hidden application fees, gift card demands, and personal UPI transfers. Genuine scholarships never charge.
              </p>
            </div>
          </div>

          <div className="landing-check-item">
            <div className="landing-check-icon">
              <Timer className="size-5" />
            </div>
            <div>
              <h3 className="landing-check-title">Pressure Heuristics</h3>
              <p className="landing-check-desc">
                Identifies false urgency, guaranteed selection without merit review, and phishing for bank or identity documents.
              </p>
            </div>
          </div>

          <div className="landing-check-item">
            <div className="landing-check-icon">
              <CheckCircle className="size-5" />
            </div>
            <div>
              <h3 className="landing-check-title">Organization Verification</h3>
              <p className="landing-check-desc">
                Cross-references org names and contact emails against known legitimate and fraudulent entities.
              </p>
            </div>
          </div>

          <div className="landing-check-item">
            <div className="landing-check-icon">
              <Users className="size-5" />
            </div>
            <div>
              <h3 className="landing-check-title">Contact Screening</h3>
              <p className="landing-check-desc">
                Flags free email providers, missing official contacts, and phone numbers that don&apos;t match organizational domains.
              </p>
            </div>
          </div>

          <div className="landing-check-item">
            <div className="landing-check-icon">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="landing-check-title">AI Deep Analysis</h3>
              <p className="landing-check-desc">
                Optional Gemini-powered analysis provides nuanced scam likelihood scores and contextual risk assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-2" />

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2 className="landing-cta-title">Start verifying scholarships today</h2>
          <p className="landing-cta-desc">
            Create a free account to access the full scam detection engine, scholarship directory, and eligibility matcher.
          </p>
          <div className="landing-hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/register">
              <Button size="lg" className="h-11 px-8 text-sm font-bold gap-2">
                Create Free Account
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
