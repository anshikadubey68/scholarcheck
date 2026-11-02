import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ScholarCheck | Scholarship scam checker",
  description: "Check a scholarship offer for fake domains, payment demands, copied text and pressure tactics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <header className="site-head">
          <div className="wrap">
            <Link href="/" className="brand">ScholarCheck</Link>
            <nav className="nav" aria-label="Main">
              <Link href="/">Check an offer</Link>
              <Link href="/directory">Directory</Link>
            </nav>
          </div>
        </header>
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}