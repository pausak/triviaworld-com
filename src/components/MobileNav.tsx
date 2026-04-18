"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/play", label: "Play", icon: "⚡" },
  { href: "/leaderboard", label: "Ranks", icon: "🏆" },
  { href: "/achievements", label: "Awards", icon: "🎖️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function MobileNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Pin the nav to the visible bottom even when the mobile browser URL/tool bar
  // retracts. Fixed positioning in some mobile browsers anchors to the layout
  // viewport, which leaves a gap below the nav after scroll.
  useEffect(() => {
    const vv = window.visualViewport;
    const nav = navRef.current;
    if (!vv || !nav) return;
    const update = () => {
      const gap = window.innerHeight - (vv.offsetTop + vv.height);
      nav.style.transform = gap > 0 ? `translate3d(0, -${gap}px, 0)` : "translate3d(0, 0, 0)";
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[var(--background)] border-t border-[var(--card-border)] safe-area-bottom will-change-transform"
    >
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
