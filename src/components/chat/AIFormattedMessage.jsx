import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** تحسين بصري للأسس والكسور البسيطة (بدون LaTeX). */
export function prettifyMath(text = "") {
  return String(text)
    .replace(/x\^2/g, "x²")
    .replace(/x\^3/g, "x³")
    .replace(/y\^2/g, "y²")
    .replace(/y\^3/g, "y³")
    .replace(/(\d+)\^2/g, "$1²")
    .replace(/(\d+)\^3/g, "$1³")
    .replace(/(\d+)\^4/g, "$1⁴")
    .replace(/\b343\/6\b/g, "343⁄6");
}

export function preprocessMathText(text = "") {
  return text
    .replace(/\\n/g, "\n")
    .replace(/x\^2/g, "x²")
    .replace(/x\^3/g, "x³")
    .replace(/y\^2/g, "y²")
    .replace(/y\^3/g, "y³")
    .replace(/\b(\d+)\^2\b/g, "$1²")
    .replace(/\b(\d+)\^3\b/g, "$1³")
    .replace(/\b(\d+)\^4\b/g, "$1⁴")
    .replace(/sqrt\((.*?)\)/g, "√($1)")
    .replace(/\bint\b/g, "∫")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/\*\*/g, "")
    .replace(/\\left|\\right|\\text|\\frac/g, "")
    .replace(/[{}]/g, "")
    .trim();
}

export default function AIFormattedMessage({ content }) {
  const processed = preprocessMathText(prettifyMath(content ?? ""));

  return (
    <div className="prose prose-sm max-w-none leading-8 text-right whitespace-pre-wrap">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {processed}
      </ReactMarkdown>
    </div>
  );
}
