"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (authError) {
        throw new Error(authError.message || "Invalid email or password.");
      }

      window.dispatchEvent(new CustomEvent("auth-change", { detail: { user: data?.user } }));
      const redirectTarget = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect") || "/dashboard"
        : "/dashboard";
      window.location.href = redirectTarget;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError(null);
    setSocialLoading(provider);
    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard",
      });
      if (res?.error) {
        throw new Error(res.error.message || `Provider ${provider} is not configured.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("provider not found") || msg.toLowerCase().includes("not configured") || msg.includes("404")) {
        setError(
          `${provider === "google" ? "Google" : "GitHub"} sign-in requires OAuth credentials. Add ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET to your .env file, or sign in with Email & Password below.`
        );
      } else {
        setError(msg);
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFillDemo = () => {
    setEmail("student@scholarcheck.org");
    setPassword("Password123!");
    setError(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[440px] shadow-lg border-line bg-card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in to access your verified checks, saved grants, and profile
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="default"
              disabled={loading || socialLoading !== null}
              onClick={() => handleSocialLogin("google")}
              className="w-full font-medium text-xs flex items-center justify-center gap-2 h-10 border-line hover:bg-muted"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {socialLoading === "google" ? "Connecting..." : "Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              disabled={loading || socialLoading !== null}
              onClick={() => handleSocialLogin("github")}
              className="w-full font-medium text-xs flex items-center justify-center gap-2 h-10 border-line hover:bg-muted"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {socialLoading === "github" ? "Connecting..." : "GitHub"}
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <Separator className="w-full" />
            <span className="absolute bg-card px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Or continue with email
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@scholarcheck.org"
                required
                autoComplete="email"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 rounded border-line accent-primary"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <KeyRound className="size-3" />
                Fill Demo Credentials
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 flex items-start gap-2 text-destructive text-xs">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 font-bold text-sm gap-2 mt-2"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 text-center">
          <div className="text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Create free student account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground border-t border-line/60 pt-3 w-full">
            <Sparkles className="size-3 text-primary" />
            <span>Secured with Better Auth session protection</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
