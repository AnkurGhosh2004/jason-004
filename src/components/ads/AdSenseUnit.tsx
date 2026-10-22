"use client";

import { useEffect } from "react";

interface AdSenseUnitProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
}

export function AdSenseUnit({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseUnitProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-4 text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7812422659353355"
        data-ad-slot={slotId || "1234567890"}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
