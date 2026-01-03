import { LMStudioClient } from "@lmstudio/sdk";

let model: any;
const client = new LMStudioClient({ baseUrl: "ws://localhost:1234" });

async function initModel() {
  console.log("test");
  model = await client.llm.model("mistralai/ministral-3-3b");
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
