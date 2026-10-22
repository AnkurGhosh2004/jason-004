"use client";

import { useState } from "react";
import { Check, Copy, Share2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playTapSound } from "@/lib/sound/effects";

interface ShareButtonsProps {
  url: string;
  title?: string;
  shareText?: string;
  isResult?: boolean;
  scoreText?: string;
}

export function ShareButtons({
  url,
  title = "Lie Loop 👀",
  shareText,
  isResult = false,
  scoreText,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const defaultShareText = isResult
    ? `I got ${scoreText || "tested"} on my friend's Lie Loop 💀\n\nCan you beat me?\n${url}`
    : `Think you know me? 👀\nTake my Lie Loop and prove it:\n${url}`;

  const messageText = shareText || defaultShareText;

  const handleCopy = async () => {
    playTapSound();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    playTapSound();
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleNativeShare = async () => {
    playTapSound();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: messageText,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="w-full flex flex-col gap-3">
      {/* WhatsApp Primary Viral Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleWhatsApp}
        className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-[#25D366]/10"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>SHARE ON WHATSAPP</span>
      </motion.button>

      <div className="grid grid-cols-2 gap-3">
        {/* Copy Link Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="py-3 px-4 rounded-xl glass-card hover:border-purple-500/50 text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5 text-emerald-400"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm">COPIED!</span>
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5 text-zinc-300"
              >
                <Copy className="w-4 h-4 text-purple-400" />
                <span className="text-sm">COPY LINK</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Native Web Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNativeShare}
          className="py-3 px-4 rounded-xl glass-card hover:border-pink-500/50 text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-pink-400" />
          <span className="text-sm">{hasNativeShare ? "SHARE" : "SHARE MORE"}</span>
        </motion.button>
      </div>
    </div>
  );
}
