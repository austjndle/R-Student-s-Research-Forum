import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans antialiased text-[var(--main-text)] bg-[var(--background)]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
