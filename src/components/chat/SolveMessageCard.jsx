import React from "react";
import { formatMathText } from "../../lib/formatMathText";
import MathText from "./MathText";

function pickTitle(d) {
  return d.title ?? d.title_en ?? d.title_ar ?? "";
}

function pickProblem(d) {
  return d.problem ?? d.problem_en ?? d.problem_ar ?? "";
}

function pickIntro(d) {
  return d.intro ?? d.intro_en ?? d.intro_ar ?? d.explanation ?? "";
}

function normalizeSteps(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((step) => {
    if (typeof step === "string") {
      return { title: step, why: "", work: [] };
    }
    return {
      title: step.title ?? step.title_en ?? step.title_ar ?? "",
      why: step.why ?? step.why_en ?? step.why_ar ?? "",
      work: Array.isArray(step.work) ? step.work : [],
    };
  });
}

function normalizeMathInput(value) {
  if (value == null) return "";
  if (typeof value === "object" && value.type === "fraction") {
    return `${value.numerator ?? ""}/${value.denominator ?? ""}`;
  }
  return String(value);
}

export default function SolveMessageCard({ data }) {
  if (!data) return null;

  const isCurriculumGrounded = data?.curriculum_grounded === true;
  const isInsufficientContext = data?.insufficient_context === true;
  const basedOnExamples = Array.isArray(data?.based_on_examples) ? data.based_on_examples : [];

  const title = pickTitle(data);
  const problem = pickProblem(data);
  const intro = pickIntro(data);
  const steps = normalizeSteps(data.steps);

  const faRaw = data.final_answer ?? data.final_answer_en ?? data.final_answer_ar ?? data.answer;
  const showFinalAnswer =
    !isInsufficientContext &&
    faRaw != null &&
    faRaw !== "" &&
    !(typeof faRaw === "string" && !faRaw.trim());

  return (
    <div className="space-y-8" dir="ltr">
      <div className="mx-auto max-w-4xl space-y-4">
        {isCurriculumGrounded ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
            This explanation is grounded in the retrieved textbook context.
          </div>
        ) : null}

        {isInsufficientContext ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 shadow-sm">
            The textbook context is not sufficient to produce a trustworthy curriculum-based
            step-by-step solution.
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {(title || problem || intro) && (
          <div className="space-y-3">
            {title ? (
              <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
                {formatMathText(title)}
              </h2>
            ) : null}

            {problem ? (
              <div className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-xl text-zinc-800 shadow-sm">
                <MathText>{normalizeMathInput(problem)}</MathText>
              </div>
            ) : null}

            {intro ? (
              <div className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5 text-lg leading-8 text-zinc-700 shadow-sm">
                {formatMathText(intro)}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {basedOnExamples.length > 0 ? (
        <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
            Based on textbook examples
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {basedOnExamples.map((example, index) => (
              <div
                key={index}
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900"
              >
                {formatMathText(String(example))}
              </div>
            ))}
          </div>

          {data.method_match_reason ? (
            <div className="whitespace-pre-wrap mt-4 rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-zinc-800">
              {formatMathText(data.method_match_reason)}
            </div>
          ) : null}
        </div>
      ) : null}

      {steps.length > 0 ? (
        steps.map((step, index) => (
          <section
            key={index}
            className="mx-auto max-w-4xl space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                Step {index + 1}
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900">
                {formatMathText(step.title)}
              </h3>
            </div>

            {step.why ? (
              <div className="rounded-2xl bg-blue-50 px-5 py-4">
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Why this step
                </div>
                <p className="whitespace-pre-wrap text-lg leading-8 text-zinc-800">
                  {formatMathText(step.why)}
                </p>
              </div>
            ) : null}

            {Array.isArray(step.work) && step.work.length > 0 ? (
              <div className="space-y-4">
                {step.work.map((item, lineIndex) => {
                  const type = item?.type || "equation";
                  const text = normalizeMathInput(item?.text || "");

                  const base =
                    "rounded-2xl border px-6 py-5 text-center text-[2rem] font-semibold leading-relaxed tracking-tight";

                  if (type === "note") {
                    return (
                      <div
                        key={lineIndex}
                        className={`${base} border-blue-100 bg-blue-50 text-zinc-800`}
                        dir="ltr"
                      >
                        <MathText>{text}</MathText>
                      </div>
                    );
                  }

                  if (type === "substitution") {
                    return (
                      <div
                        key={lineIndex}
                        className={`${base} border-amber-100 bg-amber-50 text-zinc-900`}
                        dir="ltr"
                      >
                        <MathText>{text}</MathText>
                      </div>
                    );
                  }

                  if (type === "result") {
                    return (
                      <div
                        key={lineIndex}
                        className={`${base} border-green-100 bg-green-50 text-zinc-900`}
                        dir="ltr"
                      >
                        <MathText>{text}</MathText>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={lineIndex}
                      className={`${base} border-zinc-100 bg-zinc-50 text-zinc-900`}
                      dir="ltr"
                    >
                      <MathText>{text}</MathText>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>
        ))
      ) : isInsufficientContext ? (
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white p-6 text-lg leading-8 text-zinc-700 shadow-sm">
          No step-by-step solution is shown because the retrieved textbook context was not
          sufficient.
        </div>
      ) : null}

      {showFinalAnswer ? (
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Final Answer
          </div>
          <div
            className="rounded-2xl bg-white px-6 py-5 text-3xl font-semibold text-zinc-900 shadow-sm"
            dir="ltr"
          >
            <MathText>{normalizeMathInput(faRaw)}</MathText>
          </div>
        </div>
      ) : null}

      {data.source ? (
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Source from textbook
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Lesson
              </div>
              <div className="mt-1 text-base font-medium text-zinc-900">
                {data.source.lesson || "-"}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Example
              </div>
              <div className="mt-1 text-base font-medium text-zinc-900">
                {data.source.example || "-"}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Exercise
              </div>
              <div className="mt-1 text-base font-medium text-zinc-900">
                {data.source.exercise || "-"}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Book page
              </div>
              <div className="mt-1 text-base font-medium text-zinc-900">
                {data.source.page || "-"}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
