import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { formatMathText } from "../../lib/formatMathText";

/** @deprecated استخدم formatMathText من lib/formatMathText */
export function prettifyMath(text = "") {
  return formatMathText(text);
}

export function preprocessMathText(text = "") {
  let t = String(text).replace(/\\n/g, "\n");
  t = formatMathText(t);
  t = t.replace(/\*\*/g, "");
  t = t.replace(/\\left|\\right|\\text|\\frac/g, "");
  t = t.replace(/[{}]/g, "");
  t = t.replace(/\bint\b/g, "∫");
  return t.trim();
}

function stringifyAnswerField(val) {
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && val.type === "fraction") {
    const n = String(val.numerator ?? "").trim();
    const d = String(val.denominator ?? "").trim();
    return n && d ? `${n}/${d}` : n || d || "";
  }
  return "";
}

export default function AIFormattedMessage({ content }) {
  const isObject = content != null && typeof content === "object" && !Array.isArray(content);
  const textContent =
    typeof content === "string"
      ? content
      : String(
          stringifyAnswerField(content?.answer) ||
            stringifyAnswerField(content?.final_answer) ||
            content?.explanation ||
            content?.message ||
            content?.message_en ||
            ""
        );

  const curriculumGrounded = isObject && content.curriculum_grounded === true;
  const insufficientContext = isObject && content.insufficient_context === true;

  const processed = preprocessMathText(textContent ?? "");

  return (
    <div className="space-y-4">
      {curriculumGrounded ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
          This explanation is grounded in the retrieved textbook context.
        </div>
      ) : null}
      {insufficientContext ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900 shadow-sm">
          The textbook context is not sufficient for a full curriculum-based answer here.
        </div>
      ) : null}
      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-right leading-8">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {processed}
        </ReactMarkdown>
      </div>
    </div>
  );
}
