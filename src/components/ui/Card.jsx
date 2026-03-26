import React from "react";
import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn("p-5 md:p-6", className)} {...props} />;
}

