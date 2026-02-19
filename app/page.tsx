"use client";

import { FormEvent, useState } from "react";

type ChatResponse = {
  question: string;
  answer: string;
  confidence: "high" | "medium" | "low";
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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">AI Digital Twin RAG MVP</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Ask questions grounded in <strong>data/data.json</strong>.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border p-4">
        <label htmlFor="question" className="block text-sm font-medium">
          Your question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Example: What are this candidate's strongest technical achievements?"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-60"
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error ? (
        <section className="rounded-xl border border-red-300 p-4 text-sm text-red-700 dark:border-red-700 dark:text-red-300">
          {error}
        </section>
      ) : null}

      {result ? (
        <section className="space-y-4 rounded-xl border p-4">
          <div>
            <h2 className="text-sm font-semibold">Answer</h2>
            <pre className="whitespace-pre-wrap text-sm leading-6">
              {result.answer}
            </pre>
          </div>

          <div className="text-sm">
            <strong>Confidence:</strong> {result.confidence}
          </div>

          <div>
            <h3 className="text-sm font-semibold">Evidence paths</h3>
            {result.evidence.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                No evidence found.
              </p>
            ) : (
              <ul className="list-inside list-disc text-sm">
                {result.evidence.map((path) => (
                  <li key={path}>{path}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
