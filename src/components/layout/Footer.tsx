"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on in-game screens
  if (pathname.startsWith("/create") || pathname.startsWith("/test")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-[#EBE5D8] bg-[#F5F0E4]/60 mt-auto py-8">
      <div className="max-w-md mx-auto px-4 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-xs text-[#71717A] font-medium">
          <span>Made for best friends who think they know everything</span>
          <span className="text-[#FF2B2B] ml-1">👀</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-[#52525B]">
          <Link href="/about" className="hover:text-[#FF2B2B] transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-[#FF2B2B] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#FF2B2B] transition-colors">
            Terms
          </Link>
          <Link href="/admin" className="text-stone-400 hover:text-stone-600 text-[10px] transition-colors">
            Admin
          </Link>
        </div>

        <p className="text-[11px] text-[#A1A1AA]">
          © 2026 LieLoop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
