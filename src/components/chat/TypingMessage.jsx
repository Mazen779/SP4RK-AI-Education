import React, { useEffect, useState } from "react";
import AIFormattedMessage from "./AIFormattedMessage";

export default function TypingMessage({ fullText, speed = 10 }) {
  const [displayedText, setDisplayedText] = useState("");
  const text = typeof fullText === "string" ? fullText : "";

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <AIFormattedMessage content={displayedText} />;
}
