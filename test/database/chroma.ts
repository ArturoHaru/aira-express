import test, { afterEach, beforeEach } from "node:test";
import assert from "node:assert";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import {
  client,
  addMemory,
  getAllMemory,
  queryMemory,
} from "../../database/chroma-db/chroma";

const TEST_COLLECTION_NAME: string = "test-collection";

beforeEach(async () => {
  await client.createCollection({
    name: TEST_COLLECTION_NAME,
  });
});

afterEach(async () => {
  await client.deleteCollection({ name: TEST_COLLECTION_NAME });
});

test("insert a memory in collection", async () => {
  //prepare
  const collection = await client.getOrCreateCollection({
    name: TEST_COLLECTION_NAME,
    embeddingFunction: new OpenAIEmbeddingFunction({
      apiKey: "nope",
      modelName: "text-embedding-nomic-embed-text-v1.5",
      apiBase: "http://localhost:1234/v1",
    }),
  });
  //act
  await addMemory(collection, "TEST MEMORY", 10, Date.now().toString());

  //assert
  const retrival = await collection.get();

  assert.strictEqual(retrival.documents[0], "TEST MEMORY");
  assert.strictEqual(retrival.metadatas[0]?.importance, 10);
});

test("get all added element in the collection", async () => {
  //prepare
  const collection = await client.getOrCreateCollection({
    name: TEST_COLLECTION_NAME,
    embeddingFunction: new OpenAIEmbeddingFunction({
      apiKey: "nope",
      modelName: "text-embedding-nomic-embed-text-v1.5",
      apiBase: "http://localhost:1234/v1",
    }),
  });
  //act
  for (let i = 0; i < 10; i++) {
    await addMemory(collection, "TEST MEMORY" + i, 10, Date.now().toString());
  }

  //assert
  const retrival = await getAllMemory(collection);

  for (let i = 0; i < 10; i++) {
    assert.strictEqual(retrival.documents[i], "TEST MEMORY" + i);
  }
});

test("query should return results in the collection", async () => {
  //prepare
  const collection = await client.getOrCreateCollection({
    name: TEST_COLLECTION_NAME,
    embeddingFunction: new OpenAIEmbeddingFunction({
      apiKey: "nope",
      modelName: "text-embedding-nomic-embed-text-v1.5",
      apiBase: "http://localhost:1234/v1",
    }),
  });

  await addMemory(
    collection,
    "A rainbow is a natural fenomenom",
    10,
    Date.now().toString(),
  );

  let retrieval = await queryMemory(collection, "What is a rainbow?");

  assert.strictEqual(
    retrieval.documents[0].toString(),
    "A rainbow is a natural fenomenom",
    "It has instead returned: " + retrieval.documents[0],
  );
});
