/**
 * هل الحمولة تشبه رد "solve" حتى لو غاب type/intent عن الـ API؟
 * يمنع سقوط الحل في فرع "نص عام" ثم عرض text الافتراضي الخاطئ.
 */
export function isSolveLikePayload(c) {
  if (!c || typeof c !== "object") return false;
  const type = String(c.type || "").toLowerCase();
  const intent = String(c.intent || "").toLowerCase();
  if (type === "solve" || intent === "solve") return true;
  if (
    type === "clarification" ||
    intent === "clarification" ||
    type === "error" ||
    type === "insufficient_context"
  ) {
    return false;
  }
  const problem = String(c.problem ?? c.problem_en ?? c.problem_ar ?? "").trim();
  const title = String(c.title ?? c.title_en ?? c.title_ar ?? "").trim();
  const intro = String(c.intro ?? c.intro_en ?? c.intro_ar ?? "").trim();
  const hasSteps = Array.isArray(c.steps) && c.steps.length > 0;
  const fa = c.final_answer;
  const hasFinal =
    fa != null &&
    (typeof fa === "string" || typeof fa === "number"
      ? String(fa).trim() !== ""
      : typeof fa === "object" && fa.type === "fraction"
        ? String(fa.numerator ?? "").trim() || String(fa.denominator ?? "").trim()
        : Object.keys(fa).length > 0);
  if (problem.length > 0 || hasSteps || hasFinal) return true;
  if (title.length > 0 && (intro.length > 0 || hasSteps || hasFinal || problem.length > 0))
    return true;
  return false;
}
