import { ChromaClient, Collection } from "chromadb";
import { v4 as uuidv4 } from "uuid";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

export const client = new ChromaClient({
  ssl: false,
  host: "localhost",
  port: 9876,
});

export const collection = await client.getOrCreateCollection({
  name: "memory",
  embeddingFunction: new OpenAIEmbeddingFunction({
    apiKey: "nope",
    modelName: "text-embedding-nomic-embed-text-v1.5",
  }),
  metadata: {
    description: "Long term memory of the assistant",
    created: Date.now().toString(),
  },
});

export async function addMemory(
  collection: Collection,
  memory: string,
  importance: number,
  time: string,
) {
  await collection.add({
    ids: [uuidv4()], //genero uuidv4
    documents: [memory],
    metadatas: [
      {
        importance: importance,
        time: time,
      },
    ],
  });
}

export async function getAllMemory(collection: Collection) {
  return await collection.get();
}

export async function queryMemory(collection: Collection, query: string) {
  return await collection.query({
    queryTexts: [query],
  });
}
