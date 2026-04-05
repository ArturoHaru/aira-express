import { ChatMessage } from "@lmstudio/sdk";
import { Collection } from "chromadb";
import axios from "axios";
import { model } from "../lm-studio";
import { env } from "../../env";
import { Chat } from "openai/resources.js";
import { Context } from "../context/context.service";

export function extractInformation(history: ChatMessage[]) {
  let historyString = getHistoryString(history);
  let answer = getInformationsFromHypoAgent(historyString);

  return answer;
}

function getInformationsFromHypoAgent(history: string) {
  const SYSTEM_PROMPT =
    "Estrai dalle conversazioni che ti verranno inviate una singola informazione importante riguardo l'utente che sarebbe utile l'assistete ricordasse. Rispondi con una singola frase essenziale.";

  let context = new Context(SYSTEM_PROMPT, async () => {});
  context.appendMessage("user", history);
  return model.respond(context.chat);
}

function getHistoryString(history: ChatMessage[]): string {
  let historyString = "";

  history.forEach((message) => {
    historyString += message.getRole() + ": " + message.getText() + "/n";
  });
  return historyString;
}
