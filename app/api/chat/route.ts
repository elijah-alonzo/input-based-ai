import data from "@/data/data.json";
import {
  initializeVectorStore,
  retrieveRelevant,
  generateArticle,
} from "@/lib/rag";

type ChatRequest = {
  question?: string;
};

let isInitialized = false;

export async function POST(request: Request) {
  let payload: ChatRequest;

  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const question = payload.question?.trim();

  if (!question) {
    return Response.json({ error: "`question` is required." }, { status: 400 });
  }

  try {
    // Initialize vector store on first request
    if (!isInitialized) {
      await initializeVectorStore(data);
      isInitialized = true;
    }

    const matches = await retrieveRelevant(question, 6);
    const result = await generateArticle(question, matches);

    return Response.json({
      question,
      answer: result.answer,
      evidence: result.evidence,
      matches,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
