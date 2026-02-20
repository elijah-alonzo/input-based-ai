/**
 * FILE: app/page.tsx
 *
 * ANO YUNG FILE NA TO?
 * - Ito yung main page/form na nakikita ng user
 * - May 4 input fields for project information
 * - Pag nag-submit, mag-generate ng full article
 *
 * FLOW:
 * User fills out form → Click "Generate Article" → Send to API →
 * Wait for AI → Display generated article
 */

"use client";

import { FormEvent, useState } from "react";

// Yung structure ng response na babalik from API
type ChatResponse = {
  question: string; // Yung combined prompt na sinend
  answer: string; // Yung actual article na ginawa ng AI
  evidence: string[]; // Yung sources/references na ginamit
};

export default function Home() {
  // State variables para sa 4 input fields
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [club, setClub] = useState("");
  const [narrative, setNarrative] = useState("");

  // State para sa response at UI states (loading, error, etc)
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    // Check muna if may laman man lang kahit isa sa fields
    if (
      !projectTitle.trim() &&
      !projectDate.trim() &&
      !club.trim() &&
      !narrative.trim()
    ) {
      setError("Please fill in at least one field.");
      return;
    }

    setIsLoading(true);

    try {
      // I-send natin lahat ng form fields sa API
      // Yung API yung bahala na mag-combine at mag-generate ng article
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: projectTitle.trim(),
          projectDate: projectDate.trim(),
          club: club.trim(),
          narrative: narrative.trim(),
        }),
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
      <div className="w-full max-w-2xl space-y-6">
        {/* Yung form kung saan mag-i-input yung user ng project details */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-xl font-semibold mb-4">
            Project Article Generator
          </div>

          {/* Field #1: Project Title - Yung pangalan ng project */}
          <div className="space-y-1">
            <label htmlFor="projectTitle" className="block text-sm font-medium">
              Project Title
            </label>
            <input
              id="projectTitle"
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter the project title..."
              className="w-full border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Field #2: Project Date - Kelan nangyari yung project */}
          <div className="space-y-1">
            <label htmlFor="projectDate" className="block text-sm font-medium">
              Project Date
            </label>
            <input
              id="projectDate"
              type="text"
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
              placeholder="e.g., January 2026 or 2026-01-15..."
              className="w-full border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Field #3: Club/Organization - Sino yung nag-organize */}
          <div className="space-y-1">
            <label htmlFor="club" className="block text-sm font-medium">
              Club/Organization
            </label>
            <input
              id="club"
              type="text"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              placeholder="Name of the club or organization..."
              className="w-full border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Field #4: Narrative - Dito yung detailed description (TEXTAREA, pwede maraming lines) */}
          <div className="space-y-1">
            <label htmlFor="narrative" className="block text-sm font-medium">
              Project Narrative
            </label>
            <textarea
              id="narrative"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Describe the project, its goals, activities, outcomes, and impact..."
              rows={6}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-blue-500 resize-vertical"
            />
          </div>

          {/* Button - Pag nag-click dito, mag-start na mag-generate ng article */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            {isLoading ? "Generating Article..." : "Generate Article"}
          </button>
        </form>

        {/* Pag may error, ipapakita dito (red text) */}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Pag may result na from AI, dito lalabas yung generated article */}
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
