import React, { useEffect, useState } from "react";
import AIFormattedMessage from "./AIFormattedMessage";

export default function TypingMessage({ fullText, speed = 10 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!fullText) return;

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  return <AIFormattedMessage content={displayedText} />;
}
