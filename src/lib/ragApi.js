const RAG_API_URL = "http://127.0.0.1:8010/chat";

export async function sendQuestionToRag(question) {
  const cleanedQuestion = question?.trim();

  if (!cleanedQuestion) {
    throw new Error("Question is empty");
  }

  const response = await fetch(RAG_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: cleanedQuestion,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RAG API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}
