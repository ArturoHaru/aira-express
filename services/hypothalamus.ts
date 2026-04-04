import { ChatMessage } from "@lmstudio/sdk";
import { Collection } from "chromadb";
import { Chat } from "openai/resources.js";

export function extractInformation(
  collection: Collection,
  history: ChatMessage[],
) {
  let historyString = getHistoryString(history);

  //mandala all'agente ippotalamo

  //restituisci la risposta
  
  
}

function getHistoryString(history: ChatMessage[]): string {
  let historyString = "";

  history.forEach((message) => {
    historyString += message.getRole() + ": " + message.getText() + "/n";
  });
  return historyString;
}
