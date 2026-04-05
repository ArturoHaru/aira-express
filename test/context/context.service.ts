import { Context } from "../../services/context/context.service";
import test, { afterEach, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { setTimeout } from "node:timers/promises";

test("Context should correctly contain inserted messages", async () => {
  const context = new Context("Test system prompt", async () => {}, 10000);

  context.appendMessage("user", "user test message");
  context.appendMessage("assistant", "assistant test message");

  assert.strictEqual(
    context.chat.getMessagesArray().at(0)?.getText(),
    "Test system prompt",
  );
  assert.strictEqual(
    context.chat.getMessagesArray().at(1)?.getText(),
    "user test message",
  );
  assert.strictEqual(
    context.chat.getMessagesArray().at(2)?.getText(),
    "assistant test message",
  );
});

test("Context should correctly nuke chat after timeout", async () => {
  const context = new Context(
    "Test system prompt",
    async () => {
      assert.strictEqual(context.chat.length, 0);
    },
    100,
  );

  context.appendMessage("user", "user test message");
  context.appendMessage("assistant", "assistant test message");

  assert.strictEqual(
    context.chat.getMessagesArray().at(1)?.getText(),
    "user test message",
  );
});
