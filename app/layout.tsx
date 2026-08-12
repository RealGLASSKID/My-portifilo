import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MainWrap } from "@/components/MainWrap";
import { themeInitScript } from "@/components/ThemeToggle";
import CustomCursor from "@/components/CustomCursor";
import PageViewTracker from "@/components/PageViewTracker";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glasskid.vercel.app"),
  title: {
    default: "GLASSKID | Full Stack Web Developer • Next.js • React • Firebase",
    template: "%s — GLASSKID",
  },
  description:
    "GLASSKID (Prince Dennis) — Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria. Building fast, modern, scalable web apps with React, Next.js, TypeScript, Vue, React Native and AI integrations.",
  keywords: [
    "Real GLASSKID",
    "GLASSKID",
    "Prince Dennis",
    "Full Stack Web Developer",
    "React Developer",
    "Next.js Developer",
    "Artist",
    "Songwriter",
    "Lagos Nigeria",
  ],
  authors: [{ name: "Prince Dennis" }],
  openGraph: {
    type: "website",
    url: "https://glasskid.vercel.app/",
    title: "GLASSKID | Full Stack Web Developer • Next.js • React • Firebase",
    description:
      "Full stack developer, artist and songwriter from Lagos, Nigeria building fast, modern, scalable web apps and creating music that inspires.",
    siteName: "GLASSKID",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8123adfd-fd42-4d70-979d-7d32e41fdd7b/id-preview-e80490fd--671fc3af-c6b8-453a-976f-b5ab790bc098.lovable.app-1784730682286.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLASSKID | Full Stack Web Developer • Next.js • React • Firebase",
    description:
      "GLASSKID (Prince Dennis) — Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8123adfd-fd42-4d70-979d-7d32e41fdd7b/id-preview-e80490fd--671fc3af-c6b8-453a-976f-b5ab790bc098.lovable.app-1784730682286.png",
    ],
  },
  themeColor: "#8B5CF6",
  icons: {
    icon: "/images/GK-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevents theme flash on load — sets .dark/.light before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative min-h-dvh font-sans antialiased" suppressHydrationWarning>
        <CustomCursor />
        <PageViewTracker />
        <Header />
        <MainWrap>{children}</MainWrap>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}