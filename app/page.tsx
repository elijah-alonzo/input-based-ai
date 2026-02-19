"use client";

import { FormEvent, useState } from "react";

type ChatResponse = {
  question: string;
  answer: string;
  evidence: string[];
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = question.trim();

    if (!trimmed) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const body = (await response.json()) as ChatResponse | { error?: string };

      if (!response.ok || "error" in body) {
        setError((body as { error?: string }).error ?? "Request failed.");
        return;
      }

      setResult(body as ChatResponse);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
      <div className="w-full max-w-md space-y-6">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a context..."
            className="flex-1 border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            {isLoading ? "..." : "Ask"}
          </button>
        </form>

        {error && <div className="text-sm text-red-600">{error}</div>}

        {result && (
          <div className="border border-gray-300 p-4 text-sm whitespace-pre-wrap">
            <div className="mb-2 font-semibold text-blue-700">AI Response:</div>
            <div>{result.answer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
