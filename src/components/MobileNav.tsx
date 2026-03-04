"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/play", label: "Play", icon: "⚡" },
  { href: "/leaderboard", label: "Ranks", icon: "🏆" },
  { href: "/achievements", label: "Awards", icon: "🎖️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[var(--background)] border-t border-[var(--card-border)] safe-area-bottom">
      <div className="flex justify-around py-2">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted)]"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
