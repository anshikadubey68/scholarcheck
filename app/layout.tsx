import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ScholarCheck | AI-Powered Scholarship Scam Detection & Opportunities",
  description: "Protect yourself from scholarship scams. Inspect offer links and text, discover verified government and private scholarships, and match with legitimate opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <Navbar />
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
