import express from "express";
import cors from "cors";
import { LMStudioClient } from "@lmstudio/sdk";

const app = express();
const port = 8000;

// Middleware per JSON e CORS
app.use(express.json());
app.use(cors());

const client = new LMStudioClient({ baseUrl: "ws://192.168.1.174:1234" });

let model: any;

async function initModel() {
  model = await client.llm.model("gemma-3-12b-it");
  console.log("Modello caricato con successo");
}

app.get("/", (req, res) => {
  res.send("Mettere SPA quì");
});

app.post("/api/lmstudio", async (req, res) => {
  try {
    const messaggio = req.body.messages;
    console.log("Messaggio ricevuto:", messaggio);

    if (!model) {
      return res.status(503).json({ error: "Modello non ancora pronto" });
    }

    const result = await model.respond(messaggio ?? "");
    res.json(result);
  } catch (error) {
    console.error("Errore durante la generazione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Avvio del server dopo l'inizializzazione del modello
initModel().then(() => {
  app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
  });
});
