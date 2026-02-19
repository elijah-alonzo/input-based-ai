# AI Digital Twin RAG MVP

Minimal proof-of-concept RAG app built with Next.js using `data/data.json` as the only knowledge source.

## What this MVP does
- Accepts a user question from a simple chat UI.
- Uses Upstash Vector to find relevant information from `data/data.json` via semantic search.
- Uses Groq API (Llama 3.1) to generate contextual answers based on retrieved data.
- Returns:
  - grounded answer,
  - confidence (`high` | `medium` | `low`),
  - evidence paths from the JSON.

## Project structure
- `data/data.json`: source-of-truth profile data.
- `lib/rag.ts`: vector search + LLM answer generation logic.  
- `app/api/chat/route.ts`: POST API endpoint for Q&A.
- `app/page.tsx`: MVP chat interface.
- `instructions.md`: AI-ready MVP build spec.
- `.env.local`: API credentials (Upstash Vector + Groq).

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create `.env.local` with:
   ```
   UPSTASH_VECTOR_REST_URL="your_upstash_url"
   UPSTASH_VECTOR_REST_TOKEN="your_upstash_token"
   GROQ_API_KEY="your_groq_api_key"
   ```
3. Start dev server:
   ```bash
   pnpm dev
   ```
4. Open: `http://localhost:3000`

## Example questions
- "What are this candidate's strongest technical achievements?"
- "What salary range is this person expecting?"
- "How should I prepare for behavioral interview questions?"

## Technical stack
- Next.js 16 with TypeScript
- Upstash Vector for semantic search
- Groq API (Llama 3.1) for response generation
- Local-first with external AI services
