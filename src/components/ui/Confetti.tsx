"use client";

import confetti from "canvas-confetti";

export function fireConfetti(burstCount: number = 60) {
  try {
    confetti({
      particleCount: burstCount,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#a855f7", "#ec4899", "#06b6d4", "#22c55e", "#fbbf24"],
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore error in environments without canvas
  }
}

export function fireCelebrationConfetti() {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ["#a855f7", "#ec4899", "#22c55e", "#38bdf8"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Ignore
  }
}
