import { LLM, LMStudioClient } from "@lmstudio/sdk";

export let model: LLM;
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
  async getAnswer(
    prompt: {
      role: "user" | "assistant" | "system" | undefined;
      content: string;
    }[],
  ) {
    if (!model) {
      throw new Error("Modello non ancora caricato");
    }

    const result = await model.respond<{ content: string }>(prompt);
    return result;
  },
};
await initModel();
