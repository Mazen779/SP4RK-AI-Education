import React from "react";

export function SectionTitle({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-[15px] font-semibold text-zinc-900">{title}</h3>
      {action ? <button className="text-xs text-zinc-500 hover:text-zinc-900">{action}</button> : null}
    </div>
  );
}

