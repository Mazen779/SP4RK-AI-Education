import React, { useId } from "react";
import { motion } from "framer-motion";

/**
 * Subtle abstract AI ambience behind the home search input only.
 * Stays in 10–22% perceived strength; blurred; never above content.
 */
export function AiInputBackdrop() {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className="pointer-events-none absolute -inset-x-10 -inset-y-12 z-0 overflow-hidden rounded-[40px] md:-inset-x-14 md:-inset-y-14"
      aria-hidden
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[140%] w-[130%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 55% 48% at 42% 48%, rgba(99,102,241,0.5) 0%, transparent 58%), radial-gradient(ellipse 48% 42% at 62% 52%, rgba(139,92,246,0.4) 0%, transparent 55%)",
          filter: "blur(56px)",
          opacity: 0.2,
        }}
        animate={{ x: ["-1.5%", "1.5%", "-1.5%"], y: ["0.8%", "-0.8%", "0.8%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[115%] w-[105%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.32) 0%, transparent 52%)",
          filter: "blur(44px)",
        }}
        animate={{ opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg className="absolute inset-0 h-full w-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`${uid}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.55" fill="#6366f1" />
            <circle cx="15" cy="15" r="0.45" fill="#8b5cf6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${uid}-dots)`} />
      </svg>

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${uid}-w1`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id={`${uid}-w2`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 38, repeat: Infinity, ease: "linear" }}>
          <path
            d="M0 55 Q100 45 200 55 T400 55"
            fill="none"
            stroke={`url(#${uid}-w1)`}
            strokeWidth="0.55"
            vectorEffect="non-scaling-stroke"
          />
        </motion.g>
        <motion.g animate={{ x: [0, -4, 0] }} transition={{ duration: 44, repeat: Infinity, ease: "linear" }}>
          <path
            d="M0 68 Q120 78 240 68 T400 72"
            fill="none"
            stroke={`url(#${uid}-w2)`}
            strokeWidth="0.4"
            opacity={0.75}
            vectorEffect="non-scaling-stroke"
          />
        </motion.g>
      </svg>
    </div>
  );
}
