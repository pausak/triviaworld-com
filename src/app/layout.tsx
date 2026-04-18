import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TriviaWorld - Test Your Knowledge",
    template: "%s | TriviaWorld",
  },
  description:
    "Play trivia games across multiple categories and difficulties. Compete on leaderboards, earn achievements, and track your progress.",
  metadataBase: new URL("https://triviaworld.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TriviaWorld - Test Your Knowledge",
    description:
      "Play trivia across dozens of categories. Compete on leaderboards and earn achievements.",
    type: "website",
    siteName: "TriviaWorld",
    url: "https://triviaworld.com",
  },
  twitter: {
    card: "summary",
    title: "TriviaWorld - Test Your Knowledge",
    description:
      "Play trivia across dozens of categories. Compete on leaderboards and earn achievements.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
      <body className="min-h-[100dvh] pb-16 sm:pb-0">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <MobileNav />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
