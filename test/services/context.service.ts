import { test } from "node:test";
import assert from "node:assert";
import { Context } from "../../services/context/context.service.js";

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

test("should add a new message if the latter was the assistant one", () => {
  const context = new Context("", async () => {}, 1000);
  //Simula una conversazione dove l'AI ha appena risposto
  context.appendMessage("user", "Ciao");
  context.appendMessage("assistant", "Ciao a te!");

  // Azione
  context.insertUserMessage("Come stai?");

  // Verifica
  // Assumiamo che context.chat esponga i messaggi o abbia un metodo getter
  const lastMsg = context.lastMessage();

  assert.ok(lastMsg, "Message should exist");
  assert.strictEqual(lastMsg.getRole(), "user", "Role should be 'user'");
  assert.strictEqual(
    lastMsg.getText(),
    "Come stai?",
    "Content should match input",
  );
});

test("should concatenate to last message if the latter was the user one", () => {
  const context = new Context("", async () => {}, 1000);
  //Simula una conversazione dove l'AI ha appena risposto
  context.appendMessage("user", "Ciao.");

  // Azione
  context.insertUserMessage("Come stai?");

  // Verifica
  // Assumiamo che context.chat esponga i messaggi o abbia un metodo getter
  const lastMsg = context.lastMessage();

  assert.ok(lastMsg, "Message should exist");
  assert.strictEqual(lastMsg.getRole(), "user", "Role should be 'user'");
  assert.strictEqual(
    lastMsg.getText(),
    "Ciao. Come stai?",
    `Content should match last message + new input, instead got: "${lastMsg.getText()}"`,
  );
});
