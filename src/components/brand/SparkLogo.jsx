import React from "react";
import { cn } from "../../lib/cn";

/** Minimal black spark mark for SP4RK AI */
export function SparkLogo({ className, size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-zinc-950", className)}
      aria-hidden
    >
      <path
        d="M20 4L22.5 14.5L33 17L22.5 19.5L20 30L17.5 19.5L7 17L17.5 14.5L20 4Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path d="M28 8L29 12L33 13L29 14L28 18L27 14L23 13L27 12L28 8Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}
