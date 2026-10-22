"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playTapSound } from "@/lib/sound/effects";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnabled(isSoundEnabled());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) {
      setTimeout(() => playTapSound(), 50);
    }
  };

  return (
    <button
      onClick={toggle}
      type="button"
      className="p-2 rounded-full glass-card hover:border-purple-500/40 text-zinc-400 hover:text-white transition-all flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
      title={enabled ? "Sound: ON" : "Sound: OFF (Click to enable)"}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-zinc-500" />
      )}
    </button>
  );
}
