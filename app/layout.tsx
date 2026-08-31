import type { Metadata, Viewport } from "next";
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prince Dennis",
  alternateName: ["GLASSKID", "RealGlasskid", "RealGLASSKID", "THEREALGLASSKID"],
  url: "https://glasskid.vercel.app",
  image: "https://glasskid.vercel.app/images/hero-portrait.png",
  jobTitle: "Full Stack Web Developer",
  description:
    "GLASSKID (Prince Dennis) — Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  email: "glasskid01@gmail.com",
  sameAs: [
    "https://github.com/RealGLASSKID",
    "https://www.instagram.com/Real_GLASSKID/",
    "https://web.facebook.com/profile.php?id=61590417605342",
    "https://wa.me/2349136893921",
  ],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Firebase",
    "Full Stack Web Development",
    "Music Production",
    "Songwriting",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GLASSKID",
  url: "https://glasskid.vercel.app",
  author: { "@type": "Person", name: "Prince Dennis", alternateName: ["GLASSKID", "RealGlasskid"] },
};

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
    "glasskid",
    "GLASSKID",
    "RealGlasskid",
    "RealGLASSKID",
    "realglasskid",
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

  },
  twitter: {
    card: "summary_large_image",
    title: "GLASSKID | Full Stack Web Developer • Next.js • React • Firebase",
    description:
      "GLASSKID (Prince Dennis) — Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria.",
    images: [
      "https://glasskid.vercel.app/images/hero-portrait.png",
    ],
  },
  icons: {
    icon: "https://glasskid.vercel.app/images/GK-icon.svg",
  },
  verification: {
    // Paste the content value Google Search Console gives you here once you
    // verify the site (Search Console → Settings → Ownership verification →
    // HTML tag). Leave the env var unset and this is simply omitted.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
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
        {/* Structured data so search engines and AI assistants can reliably
            identify who GLASSKID / Prince Dennis is */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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