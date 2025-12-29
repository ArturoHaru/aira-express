import express from "express";
import cors from "cors";
import { LMStudioClient } from "@lmstudio/sdk";
import axios from "axios";
import { Readable } from "stream";

const app = express();
const port = 9000;

// Middleware per JSON e CORS
app.use(express.json());
app.use(cors());

const client = new LMStudioClient({ baseUrl: "ws://192.168.1.174:1234" });

let model: any;

async function initModel() {
  console.log("test");
  model = await client.llm.model("mistralai/ministral-3-3b");
  console.log("Modello caricato con successo");
}

app.get("/", (req, res) => {
  res.send("Mettere SPA quì");
});

app.post("/api/tts", async (req, res) => {

  console.log("TTS richiesto");
  try {
    const { text, model: voiceModel, voice } = req.body;

    if (!text || !voiceModel || !voice) {
      return res.status(400).json({
        error: "Parametri mancanti: assicurati di fornire text, model, e voice.",
      });
    }

    const speachesApiUrl = "http://192.168.1.174/v1/audio/speech";

    // Indichiamo a TypeScript che ci aspettiamo uno stream di tipo 'Readable'
    const apiResponse = await axios.post<any>(
      speachesApiUrl,
      {
        input: text,
        model: voiceModel,
        voice: voice,
        response_format: "mp3",
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    apiResponse.data.pipe(res);
  } catch (error) {
    console.error("Errore durante la generazione TTS:", error);

    // `axios.isAxiosError` è la funzione corretta per restringere il tipo dell'errore 'unknown'
    if (error.response) {
      // L'API esterna ha risposto con un codice di errore (4xx o 5xx)
      res.status(error.response.status).json({
        error: "Il servizio TTS esterno ha restituito un errore.",
        status: error.response.status,
      });
    } else if (error.request) {
      // La richiesta è stata fatta ma non è stata ricevuta alcuna risposta
      res.status(504).json({ error: "Nessuna risposta dal servizio TTS (Gateway Timeout)." });
    } else {
      // Qualcosa è andato storto nella configurazione della richiesta
      res.status(500).json({ error: "Errore nell'impostare la richiesta per il servizio TTS." });
    }
  }
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

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});

/*initModel().then(() => {
  app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
  });
});*/
