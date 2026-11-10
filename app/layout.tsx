import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/ui/Providers";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { ChatWidget } from "@/features/assistant/ui";
import { WhatsNewModal } from "@/features/changelog/ui";

const plexSans = IBM_Plex_Sans({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://r-students-searchsite.rstuhub.workers.dev"),
  title: "R-Students' Research Hub — Find answers. Research smarter.",
  openGraph: {
    type: "website",
    siteName: "R-Students' Research Hub",
    title: "R-Students' Research Hub — Find answers. Research smarter.",
    description: "An independent, bilingual research and information discovery platform for students at RMIT University Vietnam.",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
  twitter: {
    card: "summary",
    title: "R-Students' Research Hub",
    description: "Independent bilingual RMIT Vietnam student information platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
  description:
    "An independent, bilingual research and information discovery platform for students at RMIT University Vietnam. Smart search, verified knowledge base, and official contact directory.",
  keywords: [
    "RMIT Vietnam",
    "RMIT students",
    "course enrolment",
    "tuition fees",
    "scholarships",
    "student connect",
    "academic calendar",
    "major transfer",
  ],
  icons: {
    icon: "/cat-meme.png",
    shortcut: "/cat-meme.png",
    apple: "/cat-meme.png",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexSans.variable} ${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-[var(--background)] font-body antialiased text-[var(--main-text)]">
        <Providers>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <WhatsNewModal />
        </Providers>
      </body>
    </html>
  );
}
