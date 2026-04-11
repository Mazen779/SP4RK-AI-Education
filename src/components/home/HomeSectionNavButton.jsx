import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Section nav — glass + AI spectrum; `active` = programmatic scroll in progress.
 */
export function HomeSectionNavButton({ direction = "down", onClick, ariaLabel, active = false }) {
  const Icon = direction === "down" ? ChevronDown : ChevronUp;
  const reduce = useReducedMotion();
  const nudge = direction === "down" ? 3.5 : -3.5;
  /** Up arrows sit at section tops — keep glow tighter so it doesn’t bleed into the section above */
  const ringInset = direction === "up" ? "-inset-[2px]" : "-inset-[3px]";

  return (
    <div className="relative inline-flex">
      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute rounded-full opacity-0",
          ringInset,
          "bg-[conic-gradient(from_120deg,rgba(139,92,246,0.45),rgba(59,130,246,0.4),rgba(34,211,238,0.38),rgba(167,139,250,0.42),rgba(139,92,246,0.45))]",
          "blur-[0.5px]"
        )}
        animate={
          reduce || !active
            ? { opacity: 0, rotate: 0 }
            : { opacity: [0.35, 0.75, 0.4], rotate: [0, 360] }
        }
        transition={
          active
            ? { opacity: { duration: 1.4, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 14, repeat: Infinity, ease: "linear" } }
            : { duration: 0.2 }
        }
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-br from-violet-400/25 via-indigo-400/20 to-cyan-400/25 opacity-0 transition-opacity duration-500"
        animate={active && !reduce ? { opacity: [0.35, 0.85, 0.45] } : { opacity: 0 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        whileTap={reduce ? undefined : "tap"}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.08 },
          tap: { scale: 0.93 },
        }}
        transition={{ type: "spring", stiffness: 420, damping: 24, mass: 0.78 }}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-full md:h-10 md:w-10",
          "border border-white/60 bg-white/55 text-zinc-700 shadow-[0_4px_28px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md",
          "transition-[box-shadow,color] duration-200",
          "hover:border-white/80 hover:bg-white/80 hover:text-zinc-900",
          "hover:shadow-[0_12px_40px_rgba(99,102,241,0.12),0_0_0_1px_rgba(255,255,255,0.55),0_0_32px_rgba(59,130,246,0.12)]",
          active && "border-white/80 text-indigo-950 shadow-[0_8px_36px_rgba(99,102,241,0.18),0_0_24px_rgba(34,211,238,0.12)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400/80"
        )}
      >
        <motion.span
          className="relative flex items-center justify-center"
          variants={{
            rest: { y: 0 },
            hover: { y: reduce ? 0 : nudge },
            tap: { y: 0 },
          }}
          transition={{ type: "spring", stiffness: 560, damping: 22 }}
        >
          <Icon
            className={cn("h-4 w-4 md:h-[18px] md:w-[18px]", active && "drop-shadow-[0_0_8px_rgba(99,102,241,0.35)]")}
            strokeWidth={2}
          />
        </motion.span>
      </motion.button>
    </div>
  );
}
