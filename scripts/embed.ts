import data from "../data/data.json";
import { initializeVectorStore } from "../lib/rag";

(async () => {
  try {
    const count = await initializeVectorStore(data);
    console.log(
      `Embedded ${count} chunks from data.json into Upstash Vector DB.`,
    );
    process.exit(0);
  } catch (err) {
    console.error("Embedding failed:", err);
    process.exit(1);
  }
})();
