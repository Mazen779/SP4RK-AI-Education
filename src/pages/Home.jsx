import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Plus, UploadCloud } from "lucide-react";
import { ContinueLearningSection } from "../components/home/ContinueLearningSection";
import { AnimatedSearchShell } from "../components/home/AnimatedSearchShell";
import { HomeSectionNavButton } from "../components/home/HomeSectionNavButton";
import { HomeSectionReveal } from "../components/home/HomeSectionReveal";
import { HomeProgressShortcutCard, HomeTasksShortcutCard } from "../components/home/HomeShortcutsPanels";
import { SubjectsCarousel } from "../components/home/SubjectsCarousel";
import { homeSubjectsCatalog } from "../data/homeSubjects";
import { useLocale } from "../lib/locale";
import { cn } from "../lib/cn";

function resumeHintKey(subject, lesson) {
  if (!lesson) return "goodProgress";
  if (lesson.review) return "needsReview";
  if (lesson.mastery >= 80 || subject.progress >= 80) return "almostComplete";
  return "goodProgress";
}

let pendingHomeSnapRestore = null;

/**
 * Programmatic section scroll: temporarily disable snap so mandatory/proximity
 * doesn’t pull into the next section mid-animation (common with trackpad + smooth).
 */
function runProgrammaticHomeScroll(root, topPx, behavior) {
  if (!root) return;
  if (pendingHomeSnapRestore) {
    window.clearTimeout(pendingHomeSnapRestore);
    pendingHomeSnapRestore = null;
  }

  root.style.scrollSnapType = "none";
  root.scrollTo({ top: Math.max(0, Math.round(topPx)), behavior });

  const restore = () => {
    root.style.scrollSnapType = "";
    pendingHomeSnapRestore = null;
  };

  const fallbackMs = behavior === "auto" ? 120 : 4200;
  pendingHomeSnapRestore = window.setTimeout(restore, fallbackMs);

  function onScrollEnd() {
    root.removeEventListener("scrollend", onScrollEnd);
    if (pendingHomeSnapRestore) {
      window.clearTimeout(pendingHomeSnapRestore);
      pendingHomeSnapRestore = null;
    }
    requestAnimationFrame(restore);
  }

  root.addEventListener("scrollend", onScrollEnd, { once: true });
}

function closestNestedScroll(el, root) {
  let node = el;
  while (node && node !== root) {
    if (node instanceof HTMLElement && node.hasAttribute("data-home-nested-scroll")) return node;
    node = node.parentElement;
  }
  return null;
}

function getActiveSnapSectionIndex(root, sectionRefs) {
  const anchor = root.scrollTop + root.clientHeight * 0.32;
  let idx = 0;
  for (let i = 0; i < sectionRefs.length; i++) {
    const el = sectionRefs[i].current;
    if (!el) continue;
    if (el.offsetTop <= anchor) idx = i;
  }
  return idx;
}

/** After a section jump: ignore wheel deltas long enough for smooth scroll + touchpad inertia to finish */
const SECTION_WHEEL_SUPPRESS_MS = 2400;

export function HomePage({ subjects, recentChats, setPage, setSelectedSubject, setSelectedLesson, lessonsBySubject, onEnterChat }) {
  const { locale, t, greeting, studentName, dir } = useLocale();
  const [mode, setMode] = useState("المراجعة");
  const [scope, setScope] = useState("general");
  const [plusOpen, setPlusOpen] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);

  const scrollRootRef = useRef(null);
  const plusBtnRef = useRef(null);
  const modeBtnRef = useRef(null);
  const [plusMenuFixed, setPlusMenuFixed] = useState(null);
  const [modeMenuFixed, setModeMenuFixed] = useState(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const wheelNavLockUntilRef = useRef(0);

  const isRTL = dir === "rtl";

  const armWheelNavLock = useCallback(() => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    wheelNavLockUntilRef.current = now + SECTION_WHEEL_SUPPRESS_MS;
  }, []);

  const scrollToSection2 = useCallback(() => {
    const root = scrollRootRef.current;
    const el = section2Ref.current;
    armWheelNavLock();
    runProgrammaticHomeScroll(root, el?.offsetTop ?? 0, "smooth");
  }, [armWheelNavLock]);

  const scrollToSection3 = useCallback(() => {
    const root = scrollRootRef.current;
    const el = section3Ref.current;
    armWheelNavLock();
    runProgrammaticHomeScroll(root, el?.offsetTop ?? 0, "smooth");
  }, [armWheelNavLock]);

  const scrollToSection2FromSection3 = useCallback(() => {
    const root = scrollRootRef.current;
    const el = section2Ref.current;
    armWheelNavLock();
    runProgrammaticHomeScroll(root, el?.offsetTop ?? 0, "smooth");
  }, [armWheelNavLock]);

  const scrollToTop = useCallback(() => {
    const root = scrollRootRef.current;
    armWheelNavLock();
    runProgrammaticHomeScroll(root, 0, "smooth");
  }, [armWheelNavLock]);

  const continueItems = useMemo(() => {
    const pick = [subjects?.[0], subjects?.[1], subjects?.[3]].filter(Boolean).slice(0, 3);
    return pick.map((s) => {
      const lesson = (lessonsBySubject?.[s.id] || [])[0];
      const lessonTitle = lesson?.title || (locale === "ar" ? "درس جديد" : "New lesson");
      const resumePoint =
        locale === "ar"
          ? lesson?.resumePointAr || lesson?.title || lessonTitle
          : lesson?.resumePointEn || lesson?.title || lessonTitle;
      return {
        subject: s,
        lesson,
        lessonTitle,
        resumePoint,
        hintKey: resumeHintKey(s, lesson),
      };
    });
  }, [subjects, lessonsBySubject, locale]);

  const modeLabels = t.home.modes;
  const pills = [
    { key: "المراجعة", label: t.home.reviewPill },
    { key: "تحليل الإجابة", label: t.home.analyzeImagePill },
    { key: "التدريب", label: t.home.organizeStudyPill },
  ];

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setPlusOpen(false);
        setModeMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useLayoutEffect(() => {
    function updateFloatMenus() {
      const vw = typeof window !== "undefined" ? window.innerWidth : 0;
      const pad = 8;
      if (plusOpen && plusBtnRef.current) {
        const r = plusBtnRef.current.getBoundingClientRect();
        const w = 224;
        setPlusMenuFixed({
          top: r.bottom + 8,
          left: Math.min(Math.max(pad, r.left), Math.max(pad, vw - w - pad)),
        });
      } else {
        setPlusMenuFixed(null);
      }
      if (modeMenuOpen && modeBtnRef.current) {
        const r = modeBtnRef.current.getBoundingClientRect();
        const w = 176;
        setModeMenuFixed({
          top: r.bottom + 8,
          left: Math.min(Math.max(pad, r.right - w), Math.max(pad, vw - w - pad)),
        });
      } else {
        setModeMenuFixed(null);
      }
    }
    updateFloatMenus();
    window.addEventListener("resize", updateFloatMenus);
    window.addEventListener("scroll", updateFloatMenus, true);
    return () => {
      window.removeEventListener("resize", updateFloatMenus);
      window.removeEventListener("scroll", updateFloatMenus, true);
    };
  }, [plusOpen, modeMenuOpen]);

  useEffect(() => {
    if (!plusOpen && !modeMenuOpen) return;
    function onPointerDown(e) {
      const t = e.target;
      if (plusBtnRef.current?.contains(t)) return;
      if (modeBtnRef.current?.contains(t)) return;
      if (t.closest?.("[data-home-float-menu]")) return;
      setPlusOpen(false);
      setModeMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [plusOpen, modeMenuOpen]);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    const sections = [section1Ref, section2Ref, section3Ref].map((r) => r.current).filter(Boolean);
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((el) => {
        el.style.opacity = "1";
      });
      return undefined;
    }
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const r = en.intersectionRatio;
          if (en.target instanceof HTMLElement) {
            en.target.style.opacity = String(0.1 + 0.9 * Math.pow(r, 1.08));
          }
        }
      },
      { root, rootMargin: "0px", threshold: thresholds }
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      sections.forEach((s) => observer.unobserve(s));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const sectionRefs = [section1Ref, section2Ref, section3Ref];
    let acc = 0;
    let accReset = 0;
    const TH = 56;

    function onScrollEnd() {
      acc = 0;
      window.clearTimeout(accReset);
      const n = typeof performance !== "undefined" ? performance.now() : Date.now();
      wheelNavLockUntilRef.current = Math.max(wheelNavLockUntilRef.current, n + 550);
    }

    root.addEventListener("scrollend", onScrollEnd);

    function onWheel(e) {
      if (!root.contains(e.target)) return;

      const nested = closestNestedScroll(e.target, root);
      if (nested) {
        const { scrollTop, scrollHeight, clientHeight } = nested;
        const eps = 6;
        const atTop = scrollTop <= eps;
        const atBottom = scrollTop + clientHeight >= scrollHeight - eps;
        if (e.deltaY > 0 && !atBottom) {
          acc = 0;
          return;
        }
        if (e.deltaY < 0 && !atTop) {
          acc = 0;
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();

      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now < wheelNavLockUntilRef.current) {
        acc = 0;
        window.clearTimeout(accReset);
        return;
      }

      acc += e.deltaY;
      window.clearTimeout(accReset);
      accReset = window.setTimeout(() => {
        acc = 0;
      }, 280);

      if (Math.abs(acc) < TH) return;

      const dir = acc > 0 ? 1 : -1;
      acc = 0;

      const idx = getActiveSnapSectionIndex(root, sectionRefs);
      const next = Math.min(2, Math.max(0, idx + dir));
      if (next === idx) return;
      const el = sectionRefs[next].current;
      if (el) {
        acc = 0;
        window.clearTimeout(accReset);
        wheelNavLockUntilRef.current = now + SECTION_WHEEL_SUPPRESS_MS;
        /* instant step: no smooth path through the next snap (trackpad inertia) */
        runProgrammaticHomeScroll(root, el.offsetTop, "auto");
      }
    }

    root.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      root.removeEventListener("scrollend", onScrollEnd);
      root.removeEventListener("wheel", onWheel, true);
      window.clearTimeout(accReset);
    };
  }, []);

  const floatMenusPortal =
    typeof document !== "undefined"
      ? createPortal(
          <>
            {plusMenuFixed ? (
              <div
                data-home-float-menu
                dir={dir}
                className="fixed z-[200] w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg"
                style={{ top: plusMenuFixed.top, left: plusMenuFixed.left }}
              >
                {[t.upload.image, t.upload.file, t.upload.document].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPlusOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    <UploadCloud className="h-4 w-4 shrink-0 text-zinc-500" />
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
            {modeMenuFixed ? (
              <div
                data-home-float-menu
                dir={dir}
                className="fixed z-[200] w-44 overflow-hidden rounded-2xl border border-zinc-200 bg-white py-1 shadow-lg"
                style={{ top: modeMenuFixed.top, left: modeMenuFixed.left }}
              >
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-start text-sm text-zinc-700 hover:bg-zinc-50"
                  onClick={() => {
                    setScope("general");
                    setModeMenuOpen(false);
                  }}
                >
                  {t.home.modeGeneral}
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-start text-sm text-zinc-700 hover:bg-zinc-50"
                  onClick={() => {
                    setScope("explain");
                    setModeMenuOpen(false);
                  }}
                >
                  {modeLabels.explain}
                </button>
              </div>
            ) : null}
          </>,
          document.body
        )
      : null;

  return (
    <>
    <div
      ref={scrollRootRef}
      className="home-page-snap-root relative h-full min-h-0 w-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-contain"
    >
      <section
        ref={section1Ref}
        id="home-section-1"
        aria-labelledby="home-hero-heading"
        className="home-section-fullsnap flex min-h-full shrink-0 flex-col bg-[#fafaf8]"
      >
        <div className="flex min-h-0 flex-1 flex-col px-0.5 pt-3 md:px-1 md:pt-4">
          <div
            className="home-nested-scroll-y min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            data-home-nested-scroll
          >
            <HomeSectionReveal>
              <header className="space-y-4 pt-0.5 md:space-y-5">
                <p
                  id="home-hero-heading"
                  className={cn(
                    "font-semibold tracking-tight text-zinc-950",
                    "text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15]"
                  )}
                >
                  {greeting()} {studentName}{" "}
                  <span className="inline-block align-middle" aria-hidden>
                    👋
                  </span>
                </p>
                <p className="max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">{t.home.subtitle}</p>
              </header>

              <div className="relative mx-auto mt-9 max-w-3xl md:mt-12">
                <div className="relative z-10">
                  <AnimatedSearchShell>
                    <div dir="ltr" className="relative px-3 py-3 sm:px-4 sm:py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          ref={plusBtnRef}
                          type="button"
                          onClick={() => setPlusOpen((v) => !v)}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200/90 bg-white text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50"
                          aria-label="Attachments"
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          dir={dir}
                          onClick={() => onEnterChat?.({ modeLabel: mode })}
                          className={cn(
                            "min-h-[44px] flex-1 px-2 text-left text-[15px] text-zinc-500 transition-colors hover:text-zinc-800",
                            isRTL && "text-right"
                          )}
                        >
                          {t.home.searchPlaceholder}
                        </button>

                        <div className="relative shrink-0">
                          <button
                            ref={modeBtnRef}
                            type="button"
                            onClick={() => setModeMenuOpen((v) => !v)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
                          >
                            {scope === "general" ? t.home.modeGeneral : modeLabels.explain}
                            <ChevronDown className={cn("h-3.5 w-3.5 text-zinc-500", modeMenuOpen && "rotate-180")} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimatedSearchShell>
                </div>
              </div>

              <div className="relative mx-auto mt-4 max-w-3xl md:mt-5">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {pills.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => {
                        setMode(m.key);
                        onEnterChat?.({ modeLabel: m.key });
                      }}
                      className={cn(
                        "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
                        "shadow-sm",
                        mode === m.key
                          ? "bg-zinc-950 text-white shadow-md ring-1 ring-zinc-950/20"
                          : "border border-zinc-200/90 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3 md:mt-8">
                <h2 className="px-0.5 text-start text-sm font-semibold text-zinc-900 md:text-base">{t.home.subjectsTitle}</h2>
                <div className="min-w-0">
                  <SubjectsCarousel
                    items={homeSubjectsCatalog}
                    locale={locale}
                    onSelect={(subjectId) => {
                      setSelectedSubject(subjectId);
                      setPage("subject");
                    }}
                  />
                </div>
              </div>
            </HomeSectionReveal>
          </div>

          <div className="flex min-h-11 shrink-0 items-center justify-center py-3 md:py-4">
            <HomeSectionNavButton direction="down" ariaLabel={t.home.navToContinue} onClick={scrollToSection2} />
          </div>
        </div>
      </section>

      <section
        ref={section2Ref}
        id="home-section-2"
        aria-label={t.home.continueTitle}
        className={cn(
          "home-section-fullsnap flex min-h-full shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-zinc-50/95 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]",
          "p-2.5 md:p-3"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 md:gap-2">
          <div className="flex min-h-11 shrink-0 items-center justify-center px-1">
            <HomeSectionNavButton direction="up" ariaLabel={t.home.navToHero} onClick={scrollToTop} />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl px-0.5">
            <HomeSectionReveal className="flex min-h-0 flex-1 flex-col">
              <div
                data-home-scroll-inner
                data-home-nested-scroll
                className="home-nested-scroll-y flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overscroll-y-contain py-0.5 md:py-1"
              >
                <ContinueLearningSection
                  compact
                  items={continueItems}
                  t={t}
                  isRTL={isRTL}
                  onContinueLesson={(item) => {
                    setSelectedSubject(item.subject.id);
                    if (item.lesson?.id) setSelectedLesson(item.lesson.id);
                    setPage("lesson");
                  }}
                  onOpenChat={(item) => {
                    setSelectedSubject(item.subject.id);
                    if (item.lesson?.id) setSelectedLesson(item.lesson.id);
                    onEnterChat?.({ modeLabel: "Explain" });
                  }}
                  onViewAll={() => setPage("subject")}
                />
              </div>
            </HomeSectionReveal>
          </div>

          <div className="flex min-h-11 shrink-0 items-center justify-center px-1 pb-1 pt-0.5">
            <HomeSectionNavButton direction="down" ariaLabel={t.home.navToShortcuts} onClick={scrollToSection3} />
          </div>
        </div>
      </section>

      <section
        ref={section3Ref}
        id="home-section-3"
        aria-labelledby="home-shortcuts-heading"
        className={cn(
          "home-section-fullsnap flex min-h-full shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-zinc-50/95 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]",
          "p-3 md:p-4"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-2 md:gap-2.5">
          <div className="flex shrink-0 justify-center px-1 pt-0.5">
            <HomeSectionNavButton direction="up" ariaLabel={t.home.navToContinueFromShortcuts} onClick={scrollToSection2FromSection3} />
          </div>

          <div
            className="home-nested-scroll-y min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            data-home-nested-scroll
          >
            <HomeSectionReveal className="min-h-0">
              <div className="flex min-h-min flex-col justify-center px-0.5 py-2 md:px-1 md:py-3">
                <h2 id="home-shortcuts-heading" className="sr-only">
                  {t.home.shortcutsSectionTitle}
                </h2>
                <div className="grid w-full max-w-none grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
                  {isRTL ? (
                    <>
                      <HomeTasksShortcutCard
                        recentChats={recentChats}
                        t={t}
                        isRTL={isRTL}
                        onOpen={() => setPage("chat")}
                      />
                      <HomeProgressShortcutCard
                        subjects={subjects}
                        t={t}
                        locale={locale}
                        onOpen={() => setPage("progress")}
                      />
                    </>
                  ) : (
                    <>
                      <HomeProgressShortcutCard
                        subjects={subjects}
                        t={t}
                        locale={locale}
                        onOpen={() => setPage("progress")}
                      />
                      <HomeTasksShortcutCard
                        recentChats={recentChats}
                        t={t}
                        isRTL={isRTL}
                        onOpen={() => setPage("chat")}
                      />
                    </>
                  )}
                </div>
              </div>
            </HomeSectionReveal>
          </div>
        </div>
      </section>
    </div>
    {floatMenusPortal}
    </>
  );
}
