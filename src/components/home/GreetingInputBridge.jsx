import React from "react";
import { motion } from "framer-motion";

/**
 * Purely decorative bridge between greeting and AI input.
 * Horizontal soft gradient glow — no text, minimal motion.
 */
export function GreetingInputBridge() {
  return (
    <div
      className="pointer-events-none flex w-full justify-center px-4 py-3 md:py-5"
      aria-hidden
    >
      <div className="relative h-8 w-full max-w-lg md:max-w-xl">
        {/* Core glow band: blue → purple, heavily blurred */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[10px] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[999px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.35) 22%, rgba(129,140,248,0.4) 50%, rgba(139,92,246,0.35) 78%, transparent 100%)",
            filter: "blur(14px)",
            opacity: 0.22,
          }}
          animate={{
            opacity: [0.14, 0.22, 0.16, 0.22, 0.14],
            scaleX: [0.94, 1, 0.97, 1, 0.94],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Tighter inner read without extra blur — keeps a hint of edge */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[2px] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.15), rgba(167,139,250,0.18), transparent)",
            filter: "blur(3px)",
            opacity: 0.35,
          }}
          animate={{
            opacity: [0.22, 0.32, 0.25, 0.32, 0.22],
            x: ["-1.5%", "1.5%", "-1.5%"],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
