const DEFAULT_MODEL = "openai/gpt-4o-mini";

function getApiKey() {
  return import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
}

function getModel() {
  return import.meta.env.VITE_OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
}

function modeSystemPrompt(mode) {
  switch (mode) {
    case "math":
      return "You are a math tutor helping a student step by step. Prioritize clear reasoning, small steps, and checking understanding.";
    case "science":
      return "You are a science tutor. Explain concepts clearly, connect ideas to simple examples, and guide the student to reason, not copy.";
    case "english":
      return "You are an English tutor. Help with grammar, vocabulary, and writing clarity using simple explanations and short examples.";
    default:
      return "You are a helpful AI study assistant for school students. Keep answers clear, concise, and level-appropriate.";
  }
}

export async function generateGeminiReply(userText, options = {}) {
  const mode = options.mode || "general";
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OpenRouter API key.");
  }

  const model = getModel();
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";
  const body = {
    model,
    messages: [
      { role: "system", content: modeSystemPrompt(mode) },
      { role: "user", content: userText },
    ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let details = "";
    try {
      const err = await response.json();
      details = err?.error?.message ? ` ${err.error.message}` : "";
    } catch {
      /* ignore */
    }
    throw new Error(`OpenRouter request failed with status ${response.status}.${details}`.trim());
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }
  return text;
}
