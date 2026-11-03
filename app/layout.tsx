import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SupportModal } from "@/components/support/SupportModal";
import { WhatsNewModal } from "@/components/changelog/WhatsNewModal";

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
  title: "R-Students' Research Forum — Find answers. Research smarter.",
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
          <SupportModal />
        </Providers>
      </body>
    </html>
  );
}
