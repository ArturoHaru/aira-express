import { Chat } from "@lmstudio/sdk";
import { model } from "../lm-studio";
import { Context } from "../context/context.service";

export async function extractInformation(history: Chat) {
  let historyString = getHistoryString(history);
  let answer = await getInformationsFromHypoAgent(historyString);

  return answer;
}

async function getInformationsFromHypoAgent(history: string) {
  const SYSTEM_PROMPT =
    "Estrai dalle conversazioni che ti verranno inviate una singola informazione importante riguardo l'utente che sarebbe utile l'assistete ricordasse. Rispondi con una singola frase essenziale.";

  let context = new Context(SYSTEM_PROMPT, async () => {});
  context.appendMessage("user", history);
  return await model.respond(context.chat);
}

function getHistoryString(history: Chat): string {
  let historyString = "";

  history.getMessagesArray().forEach((message) => {
    historyString += message.getRole() + ": " + message.getText() + "\n";
  });

  return historyString;
}
