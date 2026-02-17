import { test } from "node:test";
import assert from "node:assert";
import { Context } from "../../services/context/context.service";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("context should correctly append a user message", async () => {
  const context = new Context("", async () => {});
  context.appendMessage("user", "Questo messaggio è una prova");

  //test system prompt
  assert.strictEqual(context.chat.at(0).getText(), "");
  assert(context.chat.at(0).isSystemPrompt);
  //test messaggio
  assert.strictEqual(
    context.chat.at(1).getText(),
    "Questo messaggio è una prova",
  );
  assert(context.chat.at(1).isUserMessage);
});

test("context should not be active when chat only contains system prompt", () => {
  const context = new Context("", async () => {});
  assert.strictEqual(
    context.isActive(),
    false,
    `Context's chat has length of ${context.chat.length} instead of 1`,
  );
});

test("context should be active when chat contains more than just the system prompt", () => {
  const context = new Context("", async () => {});
  context.appendMessage("user", "Messaggio di prova");
  assert.strictEqual(context.isActive(), true);
});

test("context should not be active when chat has reached timeout", async () => {
  const context = new Context("", async () => {}, 1000);
  context.appendMessage("user", "Messaggio di prova");
  //passaggio del timer
  await sleep(1001);
  assert.strictEqual(context.isActive(), false);
});

test("last message should be correct", () => {
  const context = new Context("", async () => {}, 1000);
  context.appendMessage("user", "Messaggio di prova");

  assert.strictEqual(context.lastMessage().getText(), "Messaggio di prova");
});
