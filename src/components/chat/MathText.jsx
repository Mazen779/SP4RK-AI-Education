import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function MathText({ children, className = "" }) {
  const content = typeof children === "string" ? children : "";
  return (
    <div className={`math-text ${className}`} dir="ltr">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
