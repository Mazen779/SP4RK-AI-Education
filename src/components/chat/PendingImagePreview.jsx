import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export function PendingImagePreview({ file, onRemove, removeLabel }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  if (!url) return null;

  return (
    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-100 shadow-sm">
      <img src={url} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
        aria-label={removeLabel || "Remove image"}
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
