import { LMStudioClient } from "@lmstudio/sdk";

let model: any;
const client = new LMStudioClient({ baseUrl: process.env.LLM_WEBSOCKET });

async function initModel() {
  try {
    model = await client.llm.model("mistralai/ministral-3-3b");
  } catch (e) {
    console.error(
      "Non è stato possibile inizializzare il modello. Task relative ad ai non funzioneranno (LM Studio non è avviato?)",
    );
  }

  console.log("Modello caricato con successo");
}

export const lms = {
  async getAnswer(prompt: string) {
    if (!model) {
      return new Error("Modello non ancora caricato");
    }

    const result = await model.respond(prompt ?? "");
    return result;
  },
};
await initModel();
