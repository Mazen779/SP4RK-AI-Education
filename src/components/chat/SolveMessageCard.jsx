import React, { useMemo } from "react";

function Fraction({ numerator, denominator }) {
  return (
    <span className="inline-flex flex-col items-center align-middle mx-1">
      <span className="border-b border-current px-1 leading-none">{numerator}</span>
      <span className="px-1 leading-none">{denominator}</span>
    </span>
  );
}

function formatMath(text = "") {
  return String(text)
    .replace(/\bpi\b/g, "π")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^4/g, "⁴")
    .replace(/sin\((.*?)\)/g, "sin($1)")
    .replace(/cos\((.*?)\)/g, "cos($1)")
    .replace(/343\/6/g, "343⁄6")
    .replace(/45\/2/g, "45⁄2")
    .replace(/104\/3/g, "104⁄3")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** يطابق شكل العرض (English-first) مع حقول الـ API القديمة أو ثنائية اللغة. */
function buildView(raw) {
  const title = raw.title ?? raw.title_en ?? raw.title_ar ?? "";
  const problem = raw.problem ?? raw.problem_en ?? raw.problem_ar ?? "";
  const intro =
    raw.intro ?? raw.intro_en ?? raw.intro_ar ?? raw.explanation ?? "";

  const steps = Array.isArray(raw.steps)
    ? raw.steps.map((step) => {
        if (typeof step === "string") {
          return { title: step, why: "", work: [] };
        }
        return {
          title: step.title ?? step.title_en ?? step.title_ar ?? "",
          why: step.why ?? step.why_en ?? step.why_ar ?? "",
          work: Array.isArray(step.work) ? step.work : [],
        };
      })
    : [];

  const faRaw =
    raw.final_answer ?? raw.final_answer_en ?? raw.final_answer_ar ?? raw.answer ?? null;
  let final_answer = null;
  if (faRaw && typeof faRaw === "object" && faRaw.type === "fraction") {
    final_answer = {
      kind: "fraction",
      numerator: String(faRaw.numerator ?? ""),
      denominator: String(faRaw.denominator ?? ""),
    };
  } else {
    const s = String(faRaw ?? "").trim();
    final_answer = s ? { kind: "text", text: s } : null;
  }

  return {
    title: title || "",
    problem: problem || "",
    intro: intro || "",
    steps,
    final_answer,
    source: raw.source ?? null,
  };
}

function normalizeWorkItem(item) {
  if (typeof item === "string") {
    return { type: "equation", text: item, numerator: "", denominator: "" };
  }
  const type = item?.type || "equation";
  const numerator = item?.numerator != null ? String(item.numerator) : "";
  const denominator = item?.denominator != null ? String(item.denominator) : "";
  if (type === "fraction") {
    return { type: "fraction", text: String(item?.text ?? ""), numerator, denominator };
  }
  return { type, text: item?.text ?? "", numerator, denominator };
}

export default function SolveMessageCard({ data }) {
  if (!data) return null;

  const d = useMemo(() => buildView(data), [data]);

  const workBase =
    "rounded-2xl border px-6 py-5 text-center text-[2rem] font-semibold leading-relaxed tracking-tight";

  /** عرض معادلات واستبدالات: خط أكبر، monospace، مسافة رأسية أوضح */
  const mathDisplayBlock =
    "rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-6 text-center text-[2rem] font-semibold leading-relaxed tracking-tight font-mono text-zinc-900";

  return (
    <div className="mx-auto max-w-4xl space-y-8 leading-8 text-left" dir="ltr">
      {(d.title || d.problem || d.intro) && (
        <div className="space-y-6">
          {d.title ? (
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">{d.title}</h2>
          ) : null}
          {d.problem ? (
            <div className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-xl text-zinc-800 shadow-sm">
              {formatMath(d.problem)}
            </div>
          ) : null}
          {d.intro ? (
            <div className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5 text-lg leading-8 text-zinc-700 shadow-sm">
              {formatMath(d.intro)}
            </div>
          ) : null}
        </div>
      )}

      {Array.isArray(d.steps) &&
        d.steps.map((step, index) => (
          <section
            key={index}
            className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                Step {index + 1}
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900">
                {formatMath(step.title)}
              </h3>
            </div>

            {step.why ? (
              <div className="rounded-2xl bg-blue-50 px-5 py-4">
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Why this step
                </div>
                <p className="text-lg leading-8 text-zinc-800">{formatMath(step.why)}</p>
              </div>
            ) : null}

            {Array.isArray(step.work) && step.work.length > 0 && (
              <div className="space-y-4">
                {step.work.map((item, lineIndex) => {
                  const w = normalizeWorkItem(item);
                  const { type, text, numerator, denominator } = w;
                  const line = formatMath(text || "");

                  if (type === "note") {
                    return (
                      <div
                        key={lineIndex}
                        className={`${workBase} border border-blue-100 bg-blue-50 text-zinc-800`}
                        dir="ltr"
                      >
                        {line}
                      </div>
                    );
                  }

                  if (type === "substitution") {
                    return (
                      <div
                        key={lineIndex}
                        className={`${mathDisplayBlock} border-amber-200 bg-amber-50/80`}
                        dir="ltr"
                      >
                        {line}
                      </div>
                    );
                  }

                  if (type === "fraction") {
                    const num = formatMath(numerator);
                    const den = formatMath(denominator);
                    if (!numerator && !denominator && line) {
                      return (
                        <div
                          key={lineIndex}
                          className={`${workBase} border border-green-100 bg-green-50 font-semibold text-zinc-900`}
                          dir="ltr"
                        >
                          {line}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={lineIndex}
                        className={`${workBase} border border-green-100 bg-green-50 font-semibold text-zinc-900`}
                        dir="ltr"
                      >
                        <Fraction numerator={num || line} denominator={den || "\u00a0"} />
                      </div>
                    );
                  }

                  if (type === "result") {
                    if (numerator && denominator) {
                      return (
                        <div
                          key={lineIndex}
                          className={`${workBase} border border-green-100 bg-green-50 font-semibold text-zinc-900`}
                          dir="ltr"
                        >
                          <Fraction
                            numerator={formatMath(numerator)}
                            denominator={formatMath(denominator)}
                          />
                        </div>
                      );
                    }
                    return (
                      <div
                        key={lineIndex}
                        className={`${workBase} border border-green-100 bg-green-50 font-semibold text-zinc-900`}
                        dir="ltr"
                      >
                        {line}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={lineIndex}
                      className={`${mathDisplayBlock}`}
                      dir="ltr"
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}

      {d.final_answer ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Final Answer
          </div>
          <div
            className="rounded-2xl bg-white px-6 py-5 text-3xl font-semibold text-zinc-900 shadow-sm"
            dir="ltr"
          >
            {d.final_answer.kind === "fraction" ? (
              <span className="inline-flex items-center justify-center gap-1">
                <Fraction
                  numerator={formatMath(d.final_answer.numerator)}
                  denominator={formatMath(d.final_answer.denominator)}
                />
              </span>
            ) : (
              formatMath(d.final_answer.text)
            )}
          </div>
        </div>
      ) : null}

      {(d.source || data.based_on_examples?.length > 0 || data.method_match_reason) && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {d.source || data.based_on_examples?.length > 0
              ? "Source from textbook"
              : "Matching details"}
          </div>

          {d.source ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Lesson
                </div>
                <div className="mt-1 text-base font-medium text-zinc-900">
                  {d.source.lesson || "-"}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Example
                </div>
                <div className="mt-1 text-base font-medium text-zinc-900">
                  {d.source.example || "-"}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Page
                </div>
                <div className="mt-1 text-base font-medium text-zinc-900">
                  {d.source.page || "-"}
                </div>
              </div>
            </div>
          ) : null}

          {data.based_on_examples?.length > 0 ? (
            <div
              className={`rounded-2xl border border-indigo-200 bg-indigo-50 p-4${d.source ? " mt-4" : ""}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Based on textbook examples
              </div>
              <div className="mt-2 text-base text-zinc-900">
                {data.based_on_examples.join(", ")}
              </div>
              {data.method_match_reason ? (
                <div className="mt-2 text-sm text-zinc-700">{data.method_match_reason}</div>
              ) : null}
            </div>
          ) : data.method_match_reason ? (
            <div
              className={`rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-zinc-700${d.source ? " mt-4" : ""}`}
            >
              {data.method_match_reason}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
