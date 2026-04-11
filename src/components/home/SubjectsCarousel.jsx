import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { catalogIdToSubjectId } from "../../data/homeSubjects";
import { cn } from "../../lib/cn";

const BASE_DURATION_SEC = 56;
/** أثناء الضغط: أسرع بوضوح (~2.3× عن الأساس عند 24 مقابل 56) */
const BOOST_DURATION_SEC = 24;
const BOOST_MS = 2800;

function wrapPhase(p, loopW) {
  if (loopW <= 0) return 0;
  return ((p % loopW) + loopW) % loopW;
}

/** دائماً translateX سالب (محتوى يتحرك يساراً) — نفس السلوك البصري للعربي والإنجليزي وبدون فراغ كبير بجانب السهم في LTR */
function xFromPhase(p, loopW) {
  return -wrapPhase(p, loopW);
}

/**
 * Marquee — تلاشٍ ضيق على أقصى الحواف؛ سهم اليمين = تسريع باتجاه اليمين، سهم اليسار = باتجاه اليسار.
 */
const MAX_STRIP_COPIES = 12;

export function SubjectsCarousel({ items, locale, onSelect }) {
  const trackRef = useRef(null);
  const [loopW, setLoopW] = useState(0);
  /** تكرار كافٍ لعرض الشاشة حتى لا يظهر فراغ أو «نهاية» على شاشات عريضة */
  const [stripCopies, setStripCopies] = useState(2);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  /** تكامل الطور داخلياً — تجنب قراءة x.get() التي قد تختلف مع LTR عن القيمة المتوقعة */
  const phaseRef = useRef(0);
  const lastTRef = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const boostedRef = useRef(false);
  /** +1 = تسريع باتجاه الدورة (زيادة الطور)، -1 = عكس الاتجاه */
  const boostSignRef = useRef(1);
  const [boostSide, setBoostSide] = useState(null);
  const boostTimerRef = useRef(null);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /** قياس طول دورة: عرض أول مجموعة + فجوة flex. لا نستخدم offsetLeft − offsetLeft لأنه قد يكون ≤0 مع RTL على الجدّ حتى مع dir=ltr على الحاوية. */
    const measure = () => {
      const a = el.children[0];
      const b = el.children[1];
      if (!a || !b) return;
      const r0 = a.getBoundingClientRect();
      const r1 = b.getBoundingClientRect();
      const fromRects = Math.abs(r1.left - r0.left);
      const gs = getComputedStyle(el);
      const gapRaw = gs.columnGap || gs.gap || "0px";
      const gapPx = Number.parseFloat(String(gapRaw).trim().split(/\s+/)[0]) || 0;
      const fromWidth = a.offsetWidth + gapPx;
      const loop = fromRects > 0 ? fromRects : fromWidth;
      if (loop <= 0) return;
      setLoopW(loop);
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const needed = Math.min(MAX_STRIP_COPIES, Math.max(2, Math.ceil(vw / loop) + 2));
      setStripCopies(needed);
    };
    measure();
    const raf = requestAnimationFrame(() => measure());
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items, locale]);

  useEffect(() => {
    phaseRef.current = 0;
    x.set(0);
    lastTRef.current = performance.now();
  }, [loopW, locale, x]);

  const triggerBoost = useCallback((side) => {
    const sign = side === "right" ? 1 : -1;
    boostSignRef.current = sign;
    boostedRef.current = true;
    setBoostSide(side);
    if (boostTimerRef.current) window.clearTimeout(boostTimerRef.current);
    boostTimerRef.current = window.setTimeout(() => {
      boostedRef.current = false;
      setBoostSide(null);
    }, BOOST_MS);
  }, []);

  useEffect(
    () => () => {
      if (boostTimerRef.current) window.clearTimeout(boostTimerRef.current);
    },
    []
  );

  useAnimationFrame(() => {
    if (!loopW || reduceMotion) return;
    const now = performance.now();
    const dt = Math.min((now - lastTRef.current) / 1000, 0.064);
    lastTRef.current = now;

    const baseSpeed = loopW / BASE_DURATION_SEC;
    const boostSpeed = loopW / BOOST_DURATION_SEC;

    let p = phaseRef.current;
    let dpdt;
    if (boostedRef.current) {
      dpdt = boostSignRef.current * boostSpeed;
    } else {
      dpdt = baseSpeed;
    }
    p += dpdt * dt;
    p = wrapPhase(p, loopW);
    phaseRef.current = p;
    x.set(xFromPhase(p, loopW));
  });

  const runMarquee = !reduceMotion && loopW > 0;

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4 py-1 md:gap-5 md:py-2">
        {items.map((item) => (
          <SubjectCard key={item.id} item={item} locale={locale} onSelect={() => onSelect(catalogIdToSubjectId(item.id))} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-w-0" dir="ltr">
      <div className="relative z-0 overflow-hidden py-2 md:py-3">
        <motion.div
          ref={trackRef}
          className="flex w-max items-stretch gap-4 md:gap-6"
          style={{
            x: runMarquee ? x : 0,
            willChange: runMarquee ? "transform" : "auto",
          }}
        >
          {Array.from({ length: stripCopies }, (_, dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-stretch gap-4 md:gap-6"
              aria-hidden={dup !== 0}
            >
              {items.map((item) => (
                <SubjectCard
                  key={`${dup}-${item.id}`}
                  item={item}
                  locale={locale}
                  onSelect={() => onSelect(catalogIdToSubjectId(item.id))}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* حواف فيزيائية (يسار/يمين الشاشة) — شريط أضيق قليلاً حتى لا يبدو أن المحتوى «منتهي» */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-4 md:w-5"
        style={{
          background: "linear-gradient(90deg, #fafaf8 0%, rgba(250,250,248,0.45) 50%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-4 md:w-5"
        style={{
          background: "linear-gradient(270deg, #fafaf8 0%, rgba(250,250,248,0.45) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerBoost("left");
        }}
        className={cn(
          "absolute left-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full",
          "border border-zinc-200/90 bg-white/95 text-zinc-600 shadow-sm backdrop-blur-sm",
          "transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900",
          "active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
          boostSide === "left" && "border-indigo-200 text-indigo-700"
        )}
        aria-label={locale === "ar" ? "تسريع مؤقت باتجاه اليسار" : "Speed up to the left"}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerBoost("right");
        }}
        className={cn(
          "absolute right-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full",
          "border border-zinc-200/90 bg-white/95 text-zinc-600 shadow-sm backdrop-blur-sm",
          "transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900",
          "active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
          boostSide === "right" && "border-indigo-200 text-indigo-700"
        )}
        aria-label={locale === "ar" ? "تسريع مؤقت باتجاه اليمين" : "Speed up to the right"}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function SubjectCard({ item, locale, onSelect }) {
  const label = locale === "ar" ? item.ar : item.en;
  const Icon = item.Icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{
        scale: 1.045,
        y: -3,
        transition: { type: "spring", stiffness: 420, damping: 28 },
      }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative flex w-[156px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 bg-white text-start shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300 sm:w-[176px] md:w-[196px]",
        "min-h-[132px] p-4 md:min-h-[142px] md:p-5",
        item.accent.border,
        "hover:border-zinc-300/90 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -end-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-80",
          item.accent.glow
        )}
      />
      <div
        className={cn(
          "relative mb-3 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] md:h-14 md:w-14",
          item.accent.soft
        )}
      >
        <Icon className={cn("h-5 w-5 md:h-6 md:w-6", item.accent.text)} strokeWidth={1.75} />
      </div>
      <span className="relative text-[13px] font-semibold leading-snug tracking-tight text-zinc-900 md:text-sm">
        {label}
      </span>
    </motion.button>
  );
}
