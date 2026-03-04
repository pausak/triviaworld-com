import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "TriviaWorld — Test Your Knowledge",
  description:
    "Play trivia games across multiple categories and difficulties. Compete on leaderboards, earn achievements, and track your progress.",
  openGraph: {
    title: "TriviaWorld — Test Your Knowledge",
    description: "Play trivia across dozens of categories. Compete on leaderboards and earn achievements.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen pb-16 sm:pb-0">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <MobileNav />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
