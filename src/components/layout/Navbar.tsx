"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SoundToggle } from "@/components/ui/SoundToggle";

export function Navbar() {
  const pathname = usePathname();

  // On game screens, hide the website header to give the exact mobile app full-screen experience
  if (pathname.startsWith("/create") || pathname.startsWith("/test")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF7EF]/95 backdrop-blur-sm border-b border-[#EBE5D8]">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <span className="text-2xl font-black tracking-tight text-[#111111]">
            Lie<span className="text-[#FF2B2B]">Loop</span>
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-[#4B5563]">
          <Link
            href="/#how-it-works"
            className="hover:text-[#FF2B2B] transition-colors font-bold text-[#374151] text-[11px] sm:text-xs"
          >
            How it works
          </Link>
          <Link
            href="/about"
            className="hover:text-[#FF2B2B] transition-colors font-bold text-[#374151] text-[11px] sm:text-xs"
          >
            About
          </Link>

          <SoundToggle />

          <Link
            href="/create"
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white text-[11px] sm:text-xs font-extrabold transition-all shadow-xs active:scale-95 flex items-center justify-center shrink-0"
          >
            Create Your Test
          </Link>
        </div>
      </div>
    </header>
  );
}
